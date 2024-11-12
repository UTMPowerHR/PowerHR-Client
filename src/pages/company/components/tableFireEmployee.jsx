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
} from '@mui/material';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { useEffect, useState } from 'react';
import { Scrollbar } from '@components/scrollbar';
import dayjs from 'dayjs';
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

dayjs.extend(utc);

function TableEmployees() {
    const user = useSelector((state) => state.auth.user);
    // const employees = useSelector((state) => state.company.employees);
    const [open, setOpen] = useState(false);
    const employees = useSelector((state) => state.company.employees);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [pendingTermination, setPendingTermination] = useState(null);

    const [updateEmployee] = useUpdateEmployeeMutation();
    const [registerEmployee] = useRegisterEmployeeMutation();
    const { data: departmentsData } = useGetDepartmentsQuery(user.company);

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

    // Confirm termination with delay
    const confirmTerminateEmployee = async () => {
        setConfirmationOpen(false);
        setPendingTermination(selectedEmployee._id); // Set pending state

        setTimeout(async () => {
            try {
                // Set the current date as the termination date
                const terminationDate = dayjs().format(); // Current date
                const updatedEmployee = { ...selectedEmployee, terminationDate: terminationDate };

                await updateEmployee(updatedEmployee); // Update employee in the database

                // Update local state after successful termination
                dispatch(setEmployees(employees.map(emp => emp._id === id ? updatedEmployee : emp)));


                setPendingTermination(null); // Clear pending state
                setSelectedEmployee(null); // Reset selected employee
            } catch (error) {
                console.error("Failed to terminate employee:", error);
                setPendingTermination(null); // Clear pending state on error
            }
        }, 3000);

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
    const filteredEmployees = employees.filter((employee) => {
        const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        const email = employee.email.toLowerCase();
        return (
            fullName.includes(searchTerm.toLowerCase()) ||
            email.includes(searchTerm.toLowerCase())
        );
    });

    return (
        <>
            <Card>
                <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}>
                    <Typography variant="h5">Employees</Typography>
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
                                <TableCell>Joined</TableCell>
                                <TableCell>Terminate</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEmployees.map((employee) => {
                                const isTerminated = employee.terminationDate && dayjs(employee.terminationDate).isBefore(dayjs());
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
                                            {employee.hireDate && dayjs(employee.hireDate).format('DD MMM YYYY')}
                                        </TableCell>
                                        <TableCell>
                                            {isTerminated
                                                ? dayjs(employee.terminationDate).format('DD MMM YYYY')  // Display termination date if in the past
                                                : isPendingTermination
                                                    ? dayjs(employee.terminationDate).format('DD MMM YYYY')  // Display "Pending Termination" if in the future
                                                    : 'Active'}
                                        </TableCell>
                                        <TableCell align="right">
                                            {isTerminated ? (
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
                                                >Transfer</Button>
                                            ) : (
                                                <IconButton
                                                    onClick={() => handleTerminateClick(employee._id)}
                                                    color="error"
                                                    sx={{
                                                        border: pendingTermination === employee._id ? '0px solid' : '2px solid',
                                                        borderColor: 'error.main',
                                                        color: "error",
                                                        backgroundColor: 'transparent',
                                                        borderRadius: '8px',
                                                        padding: '6px',
                                                        fontSize: '1rem',
                                                        fontWeight: 'bold',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(255, 0, 0, 1)',
                                                            color: '#1C2536'
                                                        },

                                                    }}
                                                    disabled={pendingTermination === employee._id}
                                                >
                                                    {pendingTermination === employee._id ? 'Notified' : 'Terminate'}
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
                    <Typography>
                        Are you sure you want to terminate {selectedEmployee?.firstName} {selectedEmployee?.lastName}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmationOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmTerminateEmployee} color="error">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default TableEmployees;
