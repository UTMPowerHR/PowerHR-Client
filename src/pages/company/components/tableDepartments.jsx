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
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
    useGetDepartmentsQuery,
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
} from '@features/company/companyApiSlice';
import { setDepartments } from '@features/company/companySlice';

dayjs.extend(utc);

function TableDepartments() {
    const user = useSelector((state) => state.auth.user);
    const departments = useSelector((state) => state.company.departments);
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const dispatch = useDispatch();
    const { data: departmentsData, isSuccess } = useGetDepartmentsQuery(user.company);
    const [createDepartment] = useCreateDepartmentMutation();
    const [updateDepartment] = useUpdateDepartmentMutation();

    useEffect(() => {
        if (isSuccess) {
            dispatch(setDepartments(departmentsData.departments));
        }
    }, [departmentsData, dispatch, isSuccess]);

    const formik = useFormik({
        initialValues: {
            name: '',
            underDepartment: null,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            underDepartment: Yup.string().nullable(),
        }),
        onSubmit: (values, helpers) => {
            console.log(values);
            if (edit) {
                updateDepartment({ ...selectedDepartment, ...values })
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
                createDepartment({ ...values, company: user.company })
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

    const handleEdit = (id) => {
        const department = departments.find((department) => department._id === id);

        setSelectedDepartment(department);

        formik.setValues({
            name: department.name,
            underDepartment: department.underDepartment || null,
        });

        setOpen(true);
        setEdit(true);
    };

    return (
        <>
            <Card>
                <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="h5">Departments</Typography>
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
                                setEdit(false);
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
                                <TableCell>Under Department</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {departments.map((department) => (
                                <TableRow key={department._id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell>{department.name}</TableCell>
                                    <TableCell>
                                        {department.underDepartment
                                            ? departments.find((d) => d._id === department.underDepartment).name
                                            : '-'}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={() => {
                                                handleEdit(department._id);
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
                    count={departments.length}
                    rowsPerPage={10}
                    page={0}
                    rowsPerPageOptions={[10]}
                />
            </Card>

            <Dialog
                open={open}
                onClose={() => {
                    setOpen(false);
                    formik.resetForm();
                }}
                fullWidth
            >
                <DialogContent>
                    <Stack spacing={2}>
                        <Typography variant="h5">Add Departments</Typography>

                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Under Department</InputLabel>
                            <Select
                                label="Under Department"
                                name="underDepartment"
                                value={formik.values.underDepartment}
                                onChange={formik.handleChange}
                                error={formik.touched.underDepartment && Boolean(formik.errors.underDepartment)}
                            >
                                <MenuItem value={null}>None</MenuItem>
                                {departments.map(
                                    (department) =>
                                        selectedDepartment?._id !== department._id && (
                                            <MenuItem key={department._id} value={department._id}>
                                                {department.name}
                                            </MenuItem>
                                        ),
                                )}
                            </Select>

                            {formik.touched.underDepartment && formik.errors.underDepartment && (
                                <Typography color="error">{formik.errors.underDepartment}</Typography>
                            )}
                        </FormControl>
                    </Stack>

                    <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={formik.handleSubmit} variant="contained" color="primary">
                            {edit ? 'Update' : 'Add'}
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default TableDepartments;
