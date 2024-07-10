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
    TextField,
    Dialog,
    DialogContent,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Scrollbar } from '@components/scrollbar';
import {
    useGetEmployeesQuery,
    useUpdateEmployeeMutation,
    useRegisterEmployeeMutation,
    useGetDepartmentsQuery,
} from '@features/company/companyApiSlice';
import { setEmployees } from '@features/company/companySlice';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

dayjs.extend(utc);

function TableEmployees() {
    const user = useSelector((state) => state.auth.user);
    const employees = useSelector((state) => state.company.employees);
    const [open, setOpen] = useState(false);
    const [editEmployee, setEditEmployee] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [updateEmployee] = useUpdateEmployeeMutation();
    const [registerEmployee] = useRegisterEmployeeMutation();
    const { data: departmentsData } = useGetDepartmentsQuery(user.company);

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
        onSubmit: (values, helpers) => {
            if (editEmployee) {
                updateEmployee({ ...selectedEmployee, ...values })
                    .unwrap()
                    .then(() => {
                        setOpen(false);
                        formik.resetForm();
                    })
                    .catch((err) => {
                        const { data, error } = err;

                        helpers.setStatus({ success: false });
                        if (data) {
                            helpers.setErrors({ submit: data.error });
                        }
                        if (error) {
                            helpers.setErrors({ submit: 'Internal Server Error' });
                        }
                        helpers.setSubmitting(false);
                    });
            } else {
                registerEmployee({ ...values, company: user.company })
                    .unwrap()
                    .then(() => {
                        setOpen(false);
                        formik.resetForm();
                    })
                    .catch((err) => {
                        const { data, error } = err;

                        helpers.setStatus({ success: false });
                        if (data) {
                            helpers.setErrors({ submit: data.error });
                        }
                        if (error) {
                            helpers.setErrors({ submit: 'Internal Server Error' });
                        }
                        helpers.setSubmitting(false);
                    });
            }
        },
    });

    const dispatch = useDispatch();

    const { data, isSuccess } = useGetEmployeesQuery(user.company);

    useEffect(() => {
        if (isSuccess) {
            dispatch(setEmployees(data.employees));
        }
    }, [data, dispatch, isSuccess]);

    const handleEditEmployee = (id) => {
        const employee = employees.find((employee) => employee._id === id);

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
        setEditEmployee(true);
    };

    return (
        <>
            <Card>
                <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="h5">Employees</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <OutlinedInput
                            placeholder="Search"
                            startAdornment={
                                <InputAdornment position="start">
                                    <SvgIcon fontSize="small" color="action">
                                        <SearchMdIcon />
                                    </SvgIcon>
                                </InputAdornment>
                            }
                        />
                        <IconButton
                            onClick={() => {
                                setOpen(true);
                                setEditEmployee(false);
                            }}
                            color="primary"
                            variant="contained"
                        >
                            <SvgIcon fontSize="small">
                                <AddIcon />
                            </SvgIcon>
                        </IconButton>
                    </Stack>
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
                            {employees.map((employee) => (
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
                                        {employee.terminationDate
                                            ? dayjs(employee.terminationDate).format('DD MMM YYYY')
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={() => {
                                                handleEditEmployee(employee._id);
                                            }}
                                        >
                                            <SvgIcon fontSize="small" color="action">
                                                <Edit02Icon />
                                            </SvgIcon>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Scrollbar>
                <TablePagination
                    component="div"
                    count={employees.length}
                    rowsPerPage={10}
                    page={0}
                    rowsPerPageOptions={[10]}
                />
            </Card>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
                <DialogContent>
                    <Stack spacing={2}>
                        <Typography variant="h5">{editEmployee ? 'Edit Employee' : 'Add Employee'}</Typography>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.firstName}
                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                            helperText={formik.touched.firstName && formik.errors.firstName}
                            required
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
                            required
                        />
                        <FormControl
                            variant="filled"
                            fullWidth
                            error={!!(formik.touched.gender && formik.errors.gender)}
                            helperText={formik.touched.gender && formik.errors.gender}
                            required
                        >
                            <InputLabel>Gender</InputLabel>
                            <Select
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                name="gender"
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
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Personal Email"
                            name="personalEmail"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.personalEmail}
                            error={formik.touched.personalEmail && Boolean(formik.errors.personalEmail)}
                            helperText={formik.touched.personalEmail && formik.errors.personalEmail}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Job Title"
                            name="jobTitle"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.jobTitle}
                            error={formik.touched.jobTitle && Boolean(formik.errors.jobTitle)}
                            helperText={formik.touched.jobTitle && formik.errors.jobTitle}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Salary"
                            name="salary"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.salary}
                            error={formik.touched.salary && Boolean(formik.errors.salary)}
                            helperText={formik.touched.salary && formik.errors.salary}
                            required
                        />
                        <FormControl fullWidth required>
                            <InputLabel>Department</InputLabel>
                            <Select
                                value={formik.values.department}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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
                            <LocalizationProvider dateAdapter={AdapterDayjs} required>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker
                                        fullWidth
                                        label="Hire Date *"
                                        name="hireDate"
                                        value={formik.values.hireDate ? dayjs(formik.values.hireDate) : null}
                                        onChange={(newValue) => {
                                            formik.setFieldValue('hireDate', newValue);
                                        }}
                                        error={formik.touched.hireDate && Boolean(formik.errors.hireDate)}
                                        helperText={formik.touched.hireDate && formik.errors.hireDate}
                                        onBlur={formik.handleBlur}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker
                                        fullWidth
                                        label="Termination Date"
                                        name="terminationDate"
                                        value={
                                            formik.values.terminationDate ? dayjs(formik.values.terminationDate) : null
                                        }
                                        onChange={(newValue) => {
                                            formik.setFieldValue('terminationDate', newValue);
                                        }}
                                        error={formik.touched.terminationDate && Boolean(formik.errors.terminationDate)}
                                        helperText={formik.touched.terminationDate && formik.errors.terminationDate}
                                        onBlur={formik.handleBlur}
                                    />
                                </DemoContainer>
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
                        <Button variant="contained" color="primary" onClick={formik.handleSubmit}>
                            {editEmployee ? 'Update' : 'Add'}
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default TableEmployees;
