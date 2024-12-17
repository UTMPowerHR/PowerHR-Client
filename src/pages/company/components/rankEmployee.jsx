import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    IconButton,
    Select,
    Stack,
    OutlinedInput,
    Typography,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
} from '@mui/material';
import {
    useGetEmployeesQuery,
    useUpdateEmployeeMutation,
    useGetDepartmentsQuery,
} from '@features/company/companyApiSlice';
import dayjs from 'dayjs';
import determineRole from './roleHierarchy';
import { setEmployees } from '@features/company/companySlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

function performTOPSISAnalysis(employees, selectedRole, user) {

    const roleSpecificEmployees = employees.filter((employee) => {
        const employeeRoleLevel = determineRole(employee.jobTitle); // Get hierarchy level for the employee's role
        return employee.jobTitle === selectedRole &&
            employeeRoleLevel <= 1 &&
            employee._id !== user._id &&
            employee.terminationDate == null;
    });

    console.log(roleSpecificEmployees);

    // TOPSIS Criteria Definition
    const criteria = [
        { name: 'workExperience', weight: 0.3, type: 'benefit' },
        { name: 'performanceRating', weight: 0.3, type: 'benefit' },
        { name: 'skillLevel', weight: 0.2, type: 'benefit' },
        { name: 'trainingCost', weight: 0.2, type: 'cost' }
    ];

    // Step 2: Normalize Data
    const normalizeData = (data) => {
        const normalized = data.map(employee => ({
            ...employee,
            workExperience: dayjs().diff(dayjs(employee.hireDate), 'month'),
            performanceRating: employee.performanceRating || 3,
            skillLevel: employee.skillLevel || 3,
            trainingCost: employee.trainingCost || 5000
        }));

        const criteriaValues = {};
        criteria.forEach(criterion => {
            const values = normalized.map(e => e[criterion.name]);
            criteriaValues[criterion.name] = {
                min: Math.min(...values),
                max: Math.max(...values)
            };
        });

        return normalized.map(employee => {
            const normalizedValues = {};

            criteria.forEach(criterion => {
                const { min, max } = criteriaValues[criterion.name];
                const value = employee[criterion.name];

                // Normalize benefit and cost criteria differently
                let normalizedValue = criterion.type === 'benefit'
                    ? (value - min) / (max - min)
                    : (max - value) / (max - min);

                // Ensure normalized value is between 0 and 1
                normalizedValue = Math.max(0, Math.min(1, normalizedValue));

                // Apply weight to normalized value
                normalizedValues[criterion.name + 'Normalized'] = normalizedValue * criterion.weight;
            });

            return { ...employee, ...normalizedValues };
        });
    };

    // Step 3: Calculate TOPSIS Scores
    const calculateTOPSISScore = (normalizedData) => {
        return normalizedData.map(employee => {
            const positiveIdealDistance = Math.sqrt(
                criteria.reduce((sum, criterion) => {
                    const normalizedValue = employee[criterion.name + 'Normalized'] || 0;
                    return sum + Math.pow(1 - normalizedValue, 2);
                }, 0)
            );

            const negativeIdealDistance = Math.sqrt(
                criteria.reduce((sum, criterion) => {
                    const normalizedValue = employee[criterion.name + 'Normalized'] || 0;
                    return sum + Math.pow(0 - normalizedValue, 2);
                }, 0)
            );

            const topisisScore = negativeIdealDistance / (positiveIdealDistance + negativeIdealDistance);

            return {
                ...employee,
                topisisScore: topisisScore == 0 ? 0 : topisisScore
            };
        }).sort((a, b) => b.topisisScore - a.topisisScore);
    };

    // Execute TOPSIS Analysis
    const normalizedData = normalizeData(roleSpecificEmployees);
    return calculateTOPSISScore(normalizedData);
}

function RankEmployee() {
    
    const user = useSelector((state) => state.auth.user);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [fileError, setFileError] = useState('');
    const [noticePeriod, setNoticePeriod] = useState('Please Select');
    const [updateEmployee] = useUpdateEmployeeMutation();
    const [terminationLetter, setTerminationLetter] = useState(null);
    const employees = useSelector((state) => state.company.employees); // Fetch employees from Redux store
    const [selectedRole, setSelectedRole] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const { data: departmentsData } = useGetDepartmentsQuery(user.company);

    // Extract unique roles from employee data
    const availableRoles = [...new Set(employees.map((employee) => employee.jobTitle))];

    // Handle role selection change
    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    // Handle Run TOPSIS Analysis button click
    const handleRunTOPSIS = () => {
        const rankedEmployeeList = performTOPSISAnalysis(
            employees,
            selectedRole,
            user
        );

        // Update the filtered employees state
        setFilteredEmployees(rankedEmployeeList.slice(0, 10));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) { // Limit file size to 5MB
            setFileError('File size must be less than 5MB');
            setTerminationLetter(null);
        } else {
            setFileError('');
            setTerminationLetter(file);
        }
    };

    const handleTerminateClick = (id) => {
        const employee = employees.find((emp) => emp._id === id);
        setSelectedEmployee(employee);
        setConfirmationOpen(true);
    };

    const dispatch = useDispatch();

    const { data, isSuccess } = useGetEmployeesQuery(user.company);

    useEffect(() => {
        if (isSuccess) {
            dispatch(setEmployees(data.employees));
        }
    }, [data, dispatch, isSuccess]);

    const confirmTerminateEmployee = async () => {
        setConfirmationOpen(false);
        try {
            if (!terminationLetter) {
                console.error('Termination letter is required');
                return;
            }

            // Determine termination date based on selected notice period
            let terminationDate;
            switch (noticePeriod) {
                case '1_month':
                    terminationDate = dayjs().add(1, 'month').format();
                    break;
                case '3_months':
                    terminationDate = dayjs().add(3, 'month').format();
                    break;
                case '6_months':
                    terminationDate = dayjs().add(6, 'month').format();
                    break;
                default:
                    break;
            }

            const updatedEmployee = { ...selectedEmployee, terminationDate };

            // Create FormData to send the file
            const formData = new FormData();
            formData.append('terminationLetter', terminationLetter);
            formData.append('terminationDate', terminationDate);
            formData.append('employeeId', selectedEmployee._id);

            await updateEmployee(updatedEmployee); // Update employee in the database

            // Update local state after successful termination
            dispatch(setEmployees(
                employees.map(emp => emp._id === selectedEmployee._id ? updatedEmployee : emp)
            ));

            // Decrease the required termination count
            setRequiredTerminations((prevCount) => Math.max(prevCount - 1, 0));

            setSelectedEmployee(null); // Reset selected employee
            setTerminationLetter(null); // Clear file input
        } catch (error) {
            console.error('Failed to terminate employee:', error);
        }
    };

    return (
        <Stack spacing={4} p={0}>

            <Card sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
                <Stack spacing={3}>
                    <FormControl fullWidth>
                        <InputLabel id="role-select-label">Select Role</InputLabel>
                        <Select
                            labelId="role-select-label"
                            value={selectedRole}
                            onChange={handleRoleChange}
                            label="Select Role"
                        >
                            {availableRoles.map((role) => (
                                <MenuItem key={role} value={role}>
                                    {role}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRunTOPSIS}
                        disabled={!selectedRole}
                        sx={{
                            backgroundColor: '#4a93ec',
                            '&:hover': {
                                backgroundColor: '#3b7bc8',
                            },
                        }}
                    >
                        Run TOPSIS Analysis
                    </Button>
                </Stack>
            </Card>

            {/* Display results if there are filtered employees */}
            {filteredEmployees.length > 0 && (
                <Card sx={{ p: 4, mt: 4 }}>
                    <Typography variant="h5" mb={2}>
                        Results for Role: {selectedRole}
                    </Typography>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Joined</TableCell>
                                <TableCell>Terminate</TableCell>
                                <TableCell>TOPSIS Score</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEmployees.map((employee) => {
                                const isTerminated = employee.terminationDate && dayjs(employee.terminationDate).isSameOrBefore(dayjs());
                                const isPendingTermination = employee.terminationDate && dayjs(employee.terminationDate).isAfter(dayjs());
                                return (
                                    <TableRow key={employee._id}>
                                        <TableCell>{employee.firstName + ' ' + employee.lastName}</TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>
                                            {departmentsData &&
                                                departmentsData.departments
                                                    .filter((department) => department._id === employee.department)
                                                    .map((department) => department.name)}
                                        </TableCell>
                                        <TableCell>
                                            {employee.hireDate && dayjs(employee.hireDate).format('DD MMM YYYY')}
                                        </TableCell>
                                        <TableCell>
                                            {isTerminated
                                                ? 'Terminated'
                                                : isPendingTermination
                                                    ? dayjs(employee.terminationDate).format('DD MMM YYYY')
                                                    : 'Active'}
                                        </TableCell>
                                        <TableCell>
                                            {(employee.topisisScore * 100).toFixed(2)}%
                                        </TableCell>

                                        <TableCell align="right">

                                            <IconButton
                                                onClick={() => handleTerminateClick(employee._id)}
                                                color="error"
                                                sx={{
                                                    border: '2px solid',
                                                    borderColor: 'error.main',
                                                    color: 'error',
                                                    backgroundColor: 'transparent',
                                                    borderRadius: '8px',
                                                    padding: '6px',
                                                    fontSize: '1rem',
                                                    fontWeight: 'bold',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 0, 0, 1)',
                                                        color: '#1C2536',
                                                    },
                                                }}
                                            >
                                                Terminate
                                            </IconButton>

                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Card>
            )}

            {/* Confirmation Dialog */}
            <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
                <DialogTitle>Confirm Termination</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>
                        Are you sure you want to terminate {selectedEmployee?.firstName} {selectedEmployee?.lastName}?
                    </Typography>

                    {/* File Upload Input */}
                    <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
                        <Typography variant="body2">Select Notice Period:</Typography>
                        <Select
                            value={noticePeriod}
                            onChange={(e) => setNoticePeriod(e.target.value)}
                            fullWidth
                            displayEmpty
                            variant="outlined"
                        >
                            <MenuItem value="Please Select">Please Select</MenuItem>
                            <MenuItem value="1_month">1 Month</MenuItem>
                            <MenuItem value="3_months">3 Months</MenuItem>
                            <MenuItem value="6_months">6 Months</MenuItem>
                        </Select>

                        <Typography variant="body2">Please upload the Termination Letter:</Typography>
                        <OutlinedInput
                            type="file"
                            onChange={handleFileChange}
                            fullWidth
                            inputProps={{ accept: '.pdf,.doc,.docx' }}
                            error={!!fileError}
                        />
                        {fileError && (
                            <Typography color="error" variant="body2">
                                {fileError}
                            </Typography>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmationOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmTerminateEmployee}
                        color="error"
                        disabled={!terminationLetter || noticePeriod == "Please Select" || !/\.(pdf|doc|docx)$/i.test(terminationLetter.name)}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}

export default RankEmployee;
