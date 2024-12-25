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
    FormControlLabel,
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
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import determineRole from './roleHierarchy';
import { useGetAllEmploymentHistoryQuery } from '../../../features/employmentHistory/employmentHistoryApiSlice';

dayjs.extend(utc);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function TableRehireEmployees() {
    const user = useSelector((state) => state.auth.user);
    const employees = useSelector((state) => state.company.employees);
    // const {data: employeesData} = useGetAllEmploymentHistoryQuery();
    // const [employees, setEmployees] = useState([]);
    const [open, setOpen] = useState(false);
    const [rehiring, setRehiring] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Add missing state variables
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const dispatch = useDispatch();

    const [updateEmployee] = useUpdateEmployeeMutation();
    const { data: departmentsData } = useGetDepartmentsQuery(user.company);
    const { data, isSuccess } = useGetEmployeesQuery(user.company);
    const [requiredRehirings, setRequiredTerminations] = useState(5); // Initial count

    const departmentOptions = departmentsData ? departmentsData.departments.map(dept => dept.name) : [];
    const availableRoles = [...new Set(employees.map(employee => employee.jobTitle))];

    // useEffect(() => {
    //     if (employeesData) {
    //         setEmployees(employeesData);
    //     }
    // }, [employeesData]);

    useEffect(() => {
        if (data) {
            dispatch(setEmployees(data.employees));
        }
    }, [employees, data, dispatch]);

    // console.log(employeesData);
    const handleRehire = async () => {
        if (selectedEmployee) {
            setOpen(false);
            setRehiring(true);

            try {
                await updateEmployee({
                    ...selectedEmployee,
                    jobTitle: formik.values.jobTitle,
                    salary: formik.values.salary,
                    department: formik.values.department,
                    hireDate: formik.values.hireDate,
                    terminationDate: null,
                }).unwrap();

                dispatch(setEmployees(data.employees));
                formik.resetForm();
            } catch (error) {
                console.error("Failed to rehire employee:", error);
            } finally {
                setRehiring(false);
                setSelectedEmployee(null);
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

    const filteredEmployees = employees.filter((employee) => {
        const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        const email = employee.email.toLowerCase();
        const role = determineRole(employee.jobTitle);
        const searchTermLower = searchTerm.toLowerCase();

        // Check if employee is terminated (terminationDate is in the past or today)
        const isTerminated = employee.terminationDate &&
            dayjs(employee.terminationDate).isSameOrBefore(dayjs(), 'day');

        // Check if employee is scheduled to be hired (hireDate is in the future)
        const isScheduledForHire = employee.hireDate &&
            dayjs(employee.hireDate).isAfter(dayjs(), 'day');

        // Check if the employee matches the selected filters
        const roleMatches = selectedRoles.length === 0 || selectedRoles.includes(employee.jobTitle);
        const departmentMatches =
            selectedDepartments.length === 0 ||
            departmentsData?.departments
                .filter((dept) => selectedDepartments.includes(dept.name))
                .some((dept) => dept._id === employee.department);

        const searchMatches = searchTerm === '' ||
            fullName.includes(searchTermLower) ||
            email.includes(searchTermLower);

        return (
            employee._id !== user._id &&
            searchMatches &&
            role <= 1 &&
            roleMatches &&
            departmentMatches &&
            (isTerminated || isScheduledForHire) // Show only terminated or scheduled employees
        );
    });

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

    const handlePageChange = (event, newPage) => setPage(newPage);
    const handleRowsPerPageChange = (event) => setRowsPerPage(parseInt(event.target.value, 10));

    const [experienceRanking, setExperienceRanking] = useState([]);

    useEffect(() => {
        const calculateExperienceRanking = () => {
            const rankedEmployees = filteredEmployees
                .filter(employee => employee.terminationDate) // Only terminated employees
                .map(employee => ({
                    ...employee,
                    workExperience: dayjs(employee.terminationDate).diff(dayjs(employee.hireDate), 'day')
                }))
                .sort((a, b) => b.workExperience - a.workExperience)
                .slice(0, 10); // Top 10 employees by experience

            setExperienceRanking(rankedEmployees);
        };

        calculateExperienceRanking();
    }, [filteredEmployees]); // Use filteredEmployees instead of employees

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
                        <Typography variant="h5">Former Employees</Typography>
                        <Typography
                            variant="h6"
                            color={requiredRehirings > 0 ? 'error' : 'success'}
                        >
                            {requiredRehirings > 0
                                ? `Required Rehiring Remaining: ${requiredRehirings}`
                                : 'Rehiring Is Not Necessary! For Now...'
                            }
                        </Typography>
                        <TextField
                            placeholder="Search employees..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}

                        />
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
                                    <TableCell>Department</TableCell>
                                    <TableCell>Joined</TableCell>
                                    <TableCell>Terminate</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredEmployees
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((employee) => {
                                        // Check if employee is scheduled to be hired
                                        const isScheduledForHire = employee.hireDate &&
                                            dayjs(employee.hireDate).isAfter(dayjs(), 'day');

                                        // Check if the termination date is in the future
                                        const isTerminationFutureOrToday = employee.terminationDate &&
                                            dayjs(employee.terminationDate).isAfter(dayjs(), 'day');

                                        return (
                                            <TableRow key={employee._id}>
                                                <TableCell padding="checkbox"><Checkbox /></TableCell>
                                                <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                                                <TableCell>{employee.email}</TableCell>
                                                <TableCell>{employee.jobTitle}</TableCell>
                                                <TableCell>
                                                    {departmentsData &&
                                                        departmentsData.departments
                                                            .filter(department => department._id === employee.department)
                                                            .map(department => department.name)}
                                                </TableCell>
                                                <TableCell>{employee.hireDate && dayjs(employee.hireDate).format('DD MMM YYYY')}</TableCell>
                                                <TableCell>{employee.terminationDate ? dayjs(employee.terminationDate).format('DD MMM YYYY') : 'N/A'}</TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleOpenDialog(employee)}
                                                        disabled={
                                                            selectedEmployee && selectedEmployee._id === employee._id && rehiring ||
                                                            isScheduledForHire ||
                                                            isTerminationFutureOrToday
                                                        }
                                                    >
                                                        {selectedEmployee && selectedEmployee._id === employee._id && rehiring
                                                            ? 'Rehiring'
                                                            : isScheduledForHire
                                                                ? 'Hiring'
                                                                : 'Rehire'}
                                                    </Button>
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
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        rowsPerPageOptions={[5, 10, 25]}
                    />
                </Card>
                {/* <Card sx={{ flex: 1, minWidth: '30%', height: '100%' }}>
                    <Stack direction="column" spacing={2} p={2}>
                        <Typography variant="h6">Top 10 Employees by Experience</Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Department</TableCell>
                                    <TableCell align="right">Days Worked</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {experienceRanking.map((employee) => (
                                    <TableRow key={employee._id}>
                                        <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                                        <TableCell>
                                            {departmentsData?.departments
                                                .find(dept => dept._id === employee.department)?.name || 'N/A'}
                                        </TableCell>
                                        <TableCell align="right">{employee.workExperience}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Stack>
                </Card> */}

                <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
                    <DialogContent>
                        <Stack spacing={2}>
                            <Typography variant="h5">Edit Rehire Employee Profile</Typography>
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
                                    {departmentsData?.departments.map((department) => (
                                        <MenuItem key={department._id} value={department._id}>
                                            {department.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Stack direction="row" spacing={2} justifyContent="right">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        fullWidth
                                        label="Hire Date *"
                                        name="hireDate"
                                        value={formik.values.hireDate ? dayjs(formik.values.hireDate) : null}
                                        onChange={(newValue) => {
                                            formik.setFieldValue('hireDate', newValue ? newValue.toISOString() : null); // Store ISO string in formik
                                        }}
                                        required
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
            </Stack>
        </>
    );
}

export default TableRehireEmployees;