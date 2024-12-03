import {
    Card,
    Checkbox,
    Divider,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Stack,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    Dialog,
    DialogContent,
    Button,
    DialogActions,
    DialogTitle,
    Select,
    MenuItem,
    FormControlLabel,
} from '@mui/material';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { useEffect, useState } from 'react';
import { Scrollbar } from '@components/scrollbar';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
    useGetEmployeesQuery,
    useUpdateEmployeeMutation,
    useRegisterEmployeeMutation,
    useGetDepartmentsQuery,
} from '@features/company/companyApiSlice';
import { setEmployees } from '@features/company/companySlice';
import { useDispatch, useSelector } from 'react-redux';
import determineRole from './roleHierarchy';
import { useNavigate } from 'react-router-dom';

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);

function TableTerminateEmployees() {
    const user = useSelector((state) => state.auth.user);
    // const employees = useSelector((state) => state.company.employees);
    const [open, setOpen] = useState(false);
    const employees = useSelector((state) => state.company.employees);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [requiredTerminations, setRequiredTerminations] = useState(1); // Initial count
    const [updateEmployee] = useUpdateEmployeeMutation();
    const [terminationLetter, setTerminationLetter] = useState(null);
    const [fileError, setFileError] = useState('');
    const [noticePeriod, setNoticePeriod] = useState('immediately'); // Default value
    const { data: departmentsData } = useGetDepartmentsQuery(user.company);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const navigate = useNavigate();

    // Extract department names from the fetched data
    const departmentOptions = departmentsData ? departmentsData.departments.map(dept => dept.name) : [];
    // Extract unique roles from the employee data
    const availableRoles = [...new Set(employees.map(employee => employee.jobTitle))];

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            jobTitle: '',
            hireDate: dayjs().utc().format(),
            terminationDate: null,
            gender: '',
            department: '',
            salary: 0,
        },
        validationSchema: Yup.object().shape({
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            email: Yup.string().email('Must be a valid email').required('Email is required'),
            jobTitle: Yup.string().required('Job title is required'),
            department: Yup.string().required('Department is required'),
            hireDate: Yup.date().required('Hire date is required'),
            gender: Yup.string().required('Gender is required'),
            salary: Yup.number().required('Salary is required'),
        }),
        onSubmit: (values) => {
            setOpen(false);
            formik.resetForm();
        },
    });

    // Open confirmation dialog for termination
    const handleTerminateClick = (id) => {
        const employee = employees.find((emp) => emp._id === id);
        setSelectedEmployee(employee);
        setConfirmationOpen(true);
    };

    // Modified confirm termination function
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

    const dispatch = useDispatch();

    const { data, isSuccess } = useGetEmployeesQuery(user.company);

    useEffect(() => {
        if (isSuccess) {
            dispatch(setEmployees(data.employees));
        }
    }, [data, dispatch, isSuccess]);


    // Function to handle search input change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter employees based on the search term
    // Filter employees based on the search term and exclude the currently logged-in user
    const filteredEmployees = employees.filter((employee) => {
        const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        const email = employee.email.toLowerCase();
        const role = determineRole(employee.jobTitle);
        const hireDate = employee.hireDate && dayjs(employee.hireDate).isAfter(dayjs());

        // Check if the employee matches the selected filters
        const roleMatches = selectedRoles.length === 0 || selectedRoles.includes(employee.jobTitle);
        const departmentMatches =
            selectedDepartments.length === 0 ||
            departmentsData?.departments
                .filter((dept) => selectedDepartments.includes(dept.name))
                .some((dept) => dept._id === employee.department);

        return (
            employee._id !== user._id &&
            (fullName.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase())) &&
            role <= 1 &&
            !hireDate &&
            roleMatches &&
            departmentMatches
        );
    });



    // Handle file upload change
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

    const handleRoleChange = (event) => {
        const { value, checked } = event.target;
        setSelectedRoles((prevRoles) =>
            checked ? [...prevRoles, value] : prevRoles.filter((role) => role !== value)
        );
    };

    const handleDepartmentChange = (event) => {
        const { value, checked } = event.target;
        setSelectedDepartments((prevDepartments) =>
            checked ? [...prevDepartments, value] : prevDepartments.filter((dept) => dept !== value)
        );
    };

    const handleManageDocument = (id) => {
        navigate(`/company/transferknowledge/${id}`);
    };


    return (
        <>
            <Stack direction="row" spacing={2} p={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                <Stack direction="column" spacing={4} p={2}>
                    {/* Role Filters */}
                    <Stack direction="column">
                        <Typography variant="subtitle1">Filter by Role</Typography>
                        {availableRoles.map((role) => (
                            <FormControlLabel
                                key={role}
                                control={
                                    <Checkbox
                                        value={role}
                                        checked={selectedRoles.includes(role)}
                                        onChange={handleRoleChange}
                                    />
                                }
                                label={role}
                            />
                        ))}
                    </Stack>

                    {/* Department Filters */}
                    <Stack direction="column">
                        <Typography variant="subtitle1">Filter by Department</Typography>
                        {departmentOptions.map((dept) => (
                            <FormControlLabel
                                key={dept}
                                control={
                                    <Checkbox
                                        value={dept}
                                        checked={selectedDepartments.includes(dept)}
                                        onChange={handleDepartmentChange}
                                    />
                                }
                                label={dept}
                            />
                        ))}
                    </Stack>
                </Stack>
                <Card sx={{ flex: 2, minWidth: '60%', height: '100%' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}>
                        <Typography variant="h5">Employees</Typography>
                        <Typography
                            variant="h6"
                            color={requiredTerminations > 0 ? 'error' : '#31d436'}
                        >
                            {requiredTerminations > 0
                                ? `Termination Required : ${requiredTerminations}`
                                : 'No Termination Needed!'
                            }
                        </Typography>
                        <OutlinedInput
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            startAdornment={
                                <InputAdornment position="start">
                                    <SvgIcon fontSize="small" color="action">
                                        <SearchMdIcon />
                                    </SvgIcon>
                                </InputAdornment>
                            }
                        />
                    </Stack>
                    <Divider />
                    <Scrollbar>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Department</TableCell>
                                    <TableCell>Joined</TableCell>
                                    <TableCell>Terminate</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredEmployees.map((employee) => {
                                    const isTerminated = employee.terminationDate && dayjs(employee.terminationDate).isSameOrBefore(dayjs());
                                    const isPendingTermination = employee.terminationDate && dayjs(employee.terminationDate).isAfter(dayjs());
                                    return (
                                        <TableRow key={employee._id}>
                                            <TableCell padding="checkbox">
                                                <Checkbox />
                                            </TableCell>
                                            <TableCell>{employee.firstName + ' ' + employee.lastName}</TableCell>
                                            <TableCell>{employee.email}</TableCell>
                                            <TableCell>{employee.jobTitle}</TableCell>
                                            <TableCell>
                                                {departmentsData &&
                                                    departmentsData.departments
                                                        .filter(department => department._id === employee.department)
                                                        .map(department => department.name)}
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


                                            <TableCell align="right">
                                                {(isPendingTermination ^ isTerminated) ? (
                                                    <Button
                                                        sx={{
                                                            border: '2px solid',
                                                            borderColor: '#4a93ec',
                                                            color: '#ffffff',
                                                            backgroundColor: 'rgba(74, 147, 236, 1)',
                                                            borderRadius: '8px',
                                                            padding: '4px',
                                                            fontSize: '1rem',
                                                            fontWeight: 'bold',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(75, 132, 194, 1)',
                                                            },
                                                        }}
                                                        onClick={() => handleManageDocument(employee._id)}
                                                    >
                                                        Manage Document
                                                    </Button>
                                                ) : (
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
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>

                        </Table>
                    </Scrollbar>
                    <TablePagination
                        component="div"
                        count={filteredEmployees.length}
                        rowsPerPage={10}
                        page={0}
                        rowsPerPageOptions={[10]}
                    />
                </Card>

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

        </>
    );
}

export default TableTerminateEmployees;
