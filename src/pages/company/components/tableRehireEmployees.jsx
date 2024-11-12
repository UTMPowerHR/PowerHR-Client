import React, { useEffect, useState } from 'react';
import {
    Card,
    Checkbox,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    Button,
    Dialog,
    DialogContent,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { Scrollbar } from '@components/scrollbar';
import {
    useGetEmployeesQuery,
    useUpdateEmployeeMutation,
    useGetDepartmentsQuery,
} from '@features/company/companyApiSlice';
import { setEmployees } from '@features/company/companySlice';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

dayjs.extend(utc);

function TableRehireEmployees() {
    const user = useSelector((state) => state.auth.user);
    const employees = useSelector((state) => state.company.employees);
    const [open, setOpen] = useState(false);
    const [rehiring, setRehiring] = useState(false); // Track rehiring status

    const [updateEmployee] = useUpdateEmployeeMutation();
    const { data: departmentsData } = useGetDepartmentsQuery(user.company);

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const dispatch = useDispatch();

    const { data, isSuccess } = useGetEmployeesQuery(user.company);

    useEffect(() => {
        if (isSuccess) {
            dispatch(setEmployees(data.employees));
        }
    }, [data, isSuccess, dispatch]);

    const handleRehire = async () => {
        if (selectedEmployee) {
            setOpen(false);  // Close the dialog immediately after clicking "Rehire"
            setRehiring(true);  // Set rehiring status to true
            const rehireDate = dayjs().utc().add(3, 'day').format(); // Rehire date set 3 days in the future
    
            try {
                // Mock delay to simulate the waiting period
                setTimeout(async () => {
                    await updateEmployee({
                        ...selectedEmployee,
                        jobTitle: formik.values.jobTitle,
                        salary: formik.values.salary,
                        department: formik.values.department,
                        hireDate: rehireDate,
                        terminationDate: null,
                    }).unwrap();
    
                    dispatch(setEmployees(data.employees));
                    formik.resetForm();
                    setRehiring(false); // Reset rehiring status after completion
                }, 3000); // Mock 3-second delay (replace with actual delay logic if needed)
            } catch (error) {
                console.error("Failed to rehire employee:", error);
                setRehiring(false); // Reset on error
            }
        }
    };
    

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            personalEmail: '',
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
            personalEmail: Yup.string().email('Must be a valid email'),
            jobTitle: Yup.string().required('Job title is required'),
            department: Yup.string().required('Department is required'),
            hireDate: Yup.date().required('Hire date is required'),
            gender: Yup.string().required('Gender is required'),
            salary: Yup.number().required('Salary is required'),
        }),
        onSubmit: handleRehire,
    });

    const handleOpenDialog = (employee) => {
        setSelectedEmployee(employee);

        formik.setValues({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            personalEmail: employee.personalEmail,
            jobTitle: employee.jobTitle,
            department: employee.department,
            hireDate: employee.hireDate,
            salary: employee.salary,
            gender: employee.gender,
            terminationDate: employee.terminationDate,
        });

        setOpen(true);
    };

    const handlePageChange = (event, newPage) => setPage(newPage);
    const handleRowsPerPageChange = (event) => setRowsPerPage(parseInt(event.target.value, 10));

    return (
        <>
            <Card>
                <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}>
                    <Typography variant="h5">Former Employees</Typography>
                </Stack>
                <Divider />
                <Scrollbar>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox"><Checkbox /></TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Joined</TableCell>
                                <TableCell>Terminate</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
                                <TableRow key={employee._id}>
                                    <TableCell padding="checkbox"><Checkbox /></TableCell>
                                    <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>{employee.jobTitle}</TableCell>
                                    <TableCell>{employee.hireDate && dayjs(employee.hireDate).format('DD MMM YYYY')}</TableCell>
                                    <TableCell>{employee.terminationDate ? dayjs(employee.terminationDate).format('DD MMM YYYY') : 'N/A'}</TableCell>
                                    <TableCell align="right">
                                        {employee.terminationDate ? (
                                            <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleOpenDialog(employee)}
                                            disabled={rehiring}
                                        >
                                            {rehiring ? 'Rehiring' : 'Rehire'}
                                        </Button>
                                    ) : (
                                        <Typography color="textSecondary">Active</Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Scrollbar>
                <TablePagination
                    component="div"
                    count={employees.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Card>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
                <DialogContent>
                    <Stack spacing={2}>
                        <Typography variant="h5">Rehire Employee</Typography>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.firstName}
                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                            helperText={formik.touched.firstName && formik.errors.firstName}
                            disabled
                        />
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.lastName}
                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                            helperText={formik.touched.lastName && formik.errors.lastName}
                            disabled
                        />
                        <FormControl variant="filled" fullWidth>
                            <InputLabel>Gender</InputLabel>
                            <Select
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                                name="gender"
                                disabled
                            >
                                <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formik.values.email}
                            disabled
                        />
                        <TextField
                            fullWidth
                            label="Personal Email"
                            name="personalEmail"
                            value={formik.values.personalEmail}
                            disabled
                        />
                        <TextField
                            fullWidth
                            label="Job Title"
                            name="jobTitle"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.jobTitle}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Salary"
                            name="salary"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.salary}
                            required
                        />
                        <FormControl fullWidth required>
                            <InputLabel>Department</InputLabel>
                            <Select
                                value={formik.values.department}
                                onChange={formik.handleChange}
                                name="department"
                            >
                                {departmentsData &&
                                    departmentsData.departments.map((department) => (
                                        <MenuItem key={department._id} value={department._id}>
                                            {department.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <Stack direction="row" spacing={2} justifyContent="space-between">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    fullWidth
                                    label="Hire Date *"
                                    name="hireDate"
                                    value={formik.values.hireDate ? dayjs(formik.values.hireDate) : null}
                                    onChange={(newValue) => formik.setFieldValue('hireDate', newValue)}
                                    disabled
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    fullWidth
                                    label="Termination Date"
                                    name="terminationDate"
                                    value={
                                        formik.values.terminationDate ? dayjs(formik.values.terminationDate) : null
                                    }
                                    disabled
                                />
                            </LocalizationProvider>
                        </Stack>
                    </Stack>

                    <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setOpen(false);
                                formik.resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleRehire}
                        disabled={rehiring}
                    >
                        {rehiring ? 'Rehiring' : 'Rehire'}
                    </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default TableRehireEmployees;
