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
import emailjs from 'emailjs-com';

dayjs.extend(utc);

function TableEmployees() {
    const user = useSelector((state) => state.auth.user);
    // const employees = useSelector((state) => state.company.employees);
    const [open, setOpen] = useState(false);
    const employees = useSelector((state) => state.company.employees);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [updateEmployee] = useUpdateEmployeeMutation();
    const [terminationLetter, setTerminationLetter] = useState(null);
    const [fileError, setFileError] = useState('');

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

    // Function to send termination email
    const sendTerminationEmail = async (employee) => {
        if (!terminationLetter) {
            console.error('Termination letter is required to send an email.');
            return;
        }

        // Prepare email parameters
        const emailParams = {
            to_name: `${employee.firstName} ${employee.lastName}`,
            to_email: employee.email,
            subject: 'Termination Notice',
            termination_date: dayjs().add(1, 'month').format('DD MMM YYYY'),
            company: user.company,
            message: 'Please find the attached termination letter.',
        };

        try {
            // Send the email using EmailJS
            await emailjs.send(
                'service_24y4znc',
                'template_t8hscf8',
                emailParams,
                'RXtJM-VrBVUEqhT-y'
            );
            console.log('Termination email sent successfully');
        } catch (error) {
            console.error('Failed to send termination email:', error);
        }
    };


    // Modified confirm termination function
    const confirmTerminateEmployee = async () => {
        setConfirmationOpen(false);

        try {
            if (!terminationLetter) {
                console.error('Termination letter is required');
                return;
            }

            // Set the current date as the termination date
            const terminationDate = dayjs().add(1, 'month').format(); // One month from now
            const updatedEmployee = { ...selectedEmployee, terminationDate };

            // Create FormData to send the file
            const formData = new FormData();
            formData.append('terminationLetter', terminationLetter);
            formData.append('terminationDate', terminationDate);
            formData.append('employeeId', selectedEmployee._id);

            await updateEmployee(updatedEmployee); // Update employee in the database

            // Send termination email
            await sendTerminationEmail(selectedEmployee);

            // Update local state after successful termination
            dispatch(setEmployees(
                employees.map(emp => emp._id === selectedEmployee._id ? updatedEmployee : emp)
            ));

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

        // Exclude the logged-in user from the list
        return (
            employee._id !== user._id &&
            (fullName.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase()))
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
                                                ? dayjs(employee.terminationDate).format('DD MMM YYYY')
                                                : isPendingTermination
                                                    ? dayjs(employee.terminationDate).format('DD MMM YYYY')
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
                                                >
                                                    Transfer
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
        </>
    );
}

export default TableEmployees;
