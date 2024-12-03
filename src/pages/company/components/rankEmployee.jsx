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
    useRegisterEmployeeMutation,
    useGetDepartmentsQuery,
} from '@features/company/companyApiSlice';
import dayjs from 'dayjs';
import determineRole from './roleHierarchy';
import { setEmployees } from '@features/company/companySlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

function RankEmployee() {
    const user = useSelector((state) => state.auth.user);

    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [fileError, setFileError] = useState('');
    const [noticePeriod, setNoticePeriod] = useState('immediately');
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
        // Get the hierarchy level for the selected role
        const selectedRoleLevel = determineRole(selectedRole);

        // Filter employees based on the selected role and hierarchy level
        const roleSpecificEmployees = employees.filter((employee) => {
            const employeeRoleLevel = determineRole(employee.jobTitle); // Get hierarchy level for the employee's role
            return employee.jobTitle === selectedRole &&
                employeeRoleLevel <= 1 &&
                employee._id !== user._id &&
                employee.terminationDate == null; // Match role and ensure hierarchy <= 1
        });

        // Update the filtered employees state
        setFilteredEmployees(roleSpecificEmployees);
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
                case 'immediately':
                    terminationDate = dayjs().format(); // Today's date
                    break;
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
                    terminationDate = dayjs().format();
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
        <Stack spacing={4} p={4}>

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
                                            N/A
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
                            <MenuItem value="immediately">Immediately</MenuItem>
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
                        disabled={!terminationLetter}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}

export default RankEmployee;
