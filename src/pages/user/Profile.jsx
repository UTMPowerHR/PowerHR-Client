import { useSelector, useDispatch } from 'react-redux';
import Camera01Icon from '@untitled-ui/icons-react/build/esm/Camera01';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    SvgIcon,
    TextField,
    Typography,
    Unstable_Grid2 as Grid,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUpdateUserMutation } from '@features/user/userApiSlice';
import { setCredentials } from '@features/auth/authSlice';
import { useState } from 'react';

export default function Profile() {
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);

    const [updateUserMutation] = useUpdateUserMutation();
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingEmployee, setIsEditingEmployee] = useState(false);

    const formik = useFormik({
        initialValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
        },
        validationSchema: Yup.object().shape({
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required'),
            gender: Yup.string().required('Gender is required'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const data = await updateUserMutation({ user: values, role: 'user', id: user._id }).unwrap();
                dispatch(setCredentials({ user: data, token: token }));
                helpers.setStatus({ success: true });
                setIsEditing(false);
            } catch (err) {
                const { data, error } = err;

                helpers.setStatus({ success: false });
                if (data) {
                    helpers.setErrors({ submit: data.error });
                }
                if (error) {
                    helpers.setErrors({ submit: 'Internal Server Error' });
                }
                helpers.setSubmitting(false);
            }
        },
    });

    const formikEmployee = useFormik({
        initialValues: {
            phone: user.phone,
            address: {
                street: user.address?.street,
                city: user.address?.city,
                state: user.address?.state,
                zip: user.address?.zip,
                country: user.address?.country,
            },
        },
        validationSchema: Yup.object().shape({
            phone: Yup.string().required('Phone is required'),
            address: Yup.object().shape({
                street: Yup.string().required('Street is required'),
                city: Yup.string().required('City is required'),
                state: Yup.string().required('State is required'),
                zip: Yup.string().required('Zip is required'),
                country: Yup.string().required('Country is required'),
            }),
        }),
        onSubmit: async (values, helpers) => {
            try {
                const data = await updateUserMutation({ user: values, role: 'employee', id: user._id }).unwrap();
                dispatch(setCredentials({ user: data, token: token }));
                helpers.setStatus({ success: true });
                setIsEditingEmployee(false);
            } catch (err) {
                const { data, error } = err;

                helpers.setStatus({ success: false });
                if (data) {
                    helpers.setErrors({ submit: data.error });
                }
                if (error) {
                    helpers.setErrors({ submit: 'Internal Server Error' });
                }
                helpers.setSubmitting(false);
            }
        },
    });

    return (
        <Stack spacing={4}>
            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid xs={12} md={4}>
                            <Typography variant="h6">Basic details</Typography>
                        </Grid>
                        <Grid xs={12} md={8}>
                            <Stack spacing={3}>
                                <Stack alignItems="center" direction="row" spacing={2}>
                                    <Box
                                        sx={{
                                            borderColor: 'neutral.300',
                                            borderRadius: '50%',
                                            borderStyle: 'dashed',
                                            borderWidth: 1,
                                            p: '4px',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                borderRadius: '50%',
                                                height: '100%',
                                                width: '100%',
                                                position: 'relative',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    alignItems: 'center',
                                                    backgroundColor: (theme) => alpha(theme.palette.neutral[700], 0.5),
                                                    borderRadius: '50%',
                                                    color: 'common.white',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    height: '100%',
                                                    justifyContent: 'center',
                                                    left: 0,
                                                    opacity: 0,
                                                    position: 'absolute',
                                                    top: 0,
                                                    width: '100%',
                                                    zIndex: 1,
                                                    '&:hover': {
                                                        opacity: 1,
                                                    },
                                                }}
                                            >
                                                <Stack alignItems="center" direction="row" spacing={1}>
                                                    <SvgIcon color="inherit">
                                                        <Camera01Icon />
                                                    </SvgIcon>
                                                    <Typography
                                                        color="inherit"
                                                        variant="subtitle2"
                                                        sx={{ fontWeight: 700 }}
                                                    >
                                                        Select
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                            <Avatar
                                                src={user.avatar || ''}
                                                sx={{
                                                    height: 100,
                                                    width: 100,
                                                }}
                                            >
                                                <SvgIcon>
                                                    <User01Icon />
                                                </SvgIcon>
                                            </Avatar>
                                        </Box>
                                    </Box>
                                </Stack>
                                <Box component="form" noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
                                    <Stack spacing={2}>
                                        <TextField
                                            error={!!(formik.touched.firstName && formik.errors.firstName)}
                                            fullWidth
                                            helperText={formik.touched.firstName && formik.errors.firstName}
                                            label="First Name"
                                            name="firstName"
                                            onBlur={formik.handleBlur}
                                            onChange={(e) => {
                                                formik.handleChange(e);
                                                setIsEditing(true);
                                            }}
                                            type="text"
                                            value={formik.values.firstName}
                                        />
                                        <TextField
                                            error={!!(formik.touched.lastName && formik.errors.lastName)}
                                            fullWidth
                                            helperText={formik.touched.lastName && formik.errors.lastName}
                                            label="Last Name"
                                            name="lastName"
                                            onBlur={formik.handleBlur}
                                            onChange={(e) => {
                                                formik.handleChange(e);
                                                setIsEditing(true);
                                            }}
                                            type="text"
                                            value={formik.values.lastName}
                                        />

                                        <TextField
                                            defaultValue={user.email}
                                            disabled
                                            label="Email Address"
                                            sx={{
                                                flexGrow: 1,
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderStyle: 'dashed',
                                                },
                                            }}
                                        />

                                        <FormControl
                                            variant="filled"
                                            fullWidth
                                            error={!!(formik.touched.gender && formik.errors.gender)}
                                            helperText={formik.touched.gender && formik.errors.gender}
                                        >
                                            <InputLabel>Gender</InputLabel>
                                            <Select
                                                value={formik.values.gender}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    setIsEditing(true);
                                                }}
                                                onBlur={formik.handleBlur}
                                                name="gender"
                                            >
                                                <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                                                <MenuItem value="Male">Male</MenuItem>
                                                <MenuItem value="Female">Female</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                                            <Button
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                    formikEmployee.handleReset();
                                                    setIsEditing(false);
                                                }}
                                                disabled={!isEditing}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                disabled={formik.isSubmitting || !formik.isValid || !isEditing}
                                                type="submit"
                                            >
                                                {formik.isSubmitting ? 'Saving...' : 'Save'}
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            {user.role !== 'Applicant' && (
                <Card>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid xs={12} md={4}>
                                <Typography variant="h6">Employee details</Typography>
                            </Grid>

                            <Grid xs={12} md={8}>
                                <Stack spacing={3}>
                                    <Box
                                        component="form"
                                        noValidate
                                        autoComplete="off"
                                        onSubmit={formikEmployee.handleSubmit}
                                    >
                                        <Stack spacing={2}>
                                            <TextField
                                                error={!!(formikEmployee.touched.phone && formikEmployee.errors.phone)}
                                                fullWidth
                                                helperText={formikEmployee.touched.phone && formikEmployee.errors.phone}
                                                label="Phone"
                                                name="phone"
                                                onBlur={formikEmployee.handleBlur}
                                                onChange={(e) => {
                                                    formikEmployee.handleChange(e);
                                                    setIsEditingEmployee(true);
                                                }}
                                                type="text"
                                                value={formikEmployee.values.phone}
                                            />
                                            <TextField
                                                error={
                                                    !!(
                                                        formikEmployee.touched.address?.street &&
                                                        formikEmployee.errors.address?.street
                                                    )
                                                }
                                                fullWidth
                                                helperText={
                                                    formikEmployee.touched.address?.street &&
                                                    formikEmployee.errors.address?.street
                                                }
                                                label="Street"
                                                name="address.street"
                                                onBlur={formikEmployee.handleBlur}
                                                onChange={(e) => {
                                                    formikEmployee.handleChange(e);
                                                    setIsEditingEmployee(true);
                                                }}
                                                type="text"
                                                value={formikEmployee.values.address.street}
                                            />
                                            <TextField
                                                error={
                                                    !!(
                                                        formikEmployee.touched.address?.city &&
                                                        formikEmployee.errors.address?.city
                                                    )
                                                }
                                                fullWidth
                                                helperText={
                                                    formikEmployee.touched.address?.city &&
                                                    formikEmployee.errors.address?.city
                                                }
                                                label="City"
                                                name="address.city"
                                                onBlur={formikEmployee.handleBlur}
                                                onChange={(e) => {
                                                    formikEmployee.handleChange(e);
                                                    setIsEditingEmployee(true);
                                                }}
                                                type="text"
                                                value={formikEmployee.values.address.city}
                                            />
                                            <TextField
                                                error={
                                                    !!(
                                                        formikEmployee.touched.address?.state &&
                                                        formikEmployee.errors.address?.state
                                                    )
                                                }
                                                fullWidth
                                                helperText={
                                                    formikEmployee.touched.address?.state &&
                                                    formikEmployee.errors.address?.state
                                                }
                                                label="State"
                                                name="address.state"
                                                onBlur={formikEmployee.handleBlur}
                                                onChange={(e) => {
                                                    formikEmployee.handleChange(e);
                                                    setIsEditingEmployee(true);
                                                }}
                                                type="text"
                                                value={formikEmployee.values.address.state}
                                            />
                                            <TextField
                                                error={
                                                    !!(
                                                        formikEmployee.touched.address?.zip &&
                                                        formikEmployee.errors.address?.zip
                                                    )
                                                }
                                                fullWidth
                                                helperText={
                                                    formikEmployee.touched.address?.zip &&
                                                    formikEmployee.errors.address?.zip
                                                }
                                                label="Zip"
                                                name="address.zip"
                                                onBlur={formikEmployee.handleBlur}
                                                onChange={(e) => {
                                                    formikEmployee.handleChange(e);
                                                    setIsEditingEmployee(true);
                                                }}
                                                type="text"
                                                value={formikEmployee.values.address.zip}
                                            />
                                            <TextField
                                                error={
                                                    !!(
                                                        formikEmployee.touched.address?.country &&
                                                        formikEmployee.errors.address?.country
                                                    )
                                                }
                                                fullWidth
                                                helperText={
                                                    formikEmployee.touched.address?.country &&
                                                    formikEmployee.errors.address?.country
                                                }
                                                label="Country"
                                                name="address.country"
                                                onBlur={formikEmployee.handleBlur}
                                                onChange={(e) => {
                                                    formikEmployee.handleChange(e);
                                                    setIsEditingEmployee(true);
                                                }}
                                                type="text"
                                                value={formikEmployee.values.address.country}
                                            />
                                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                                <Button
                                                    color="inherit"
                                                    size="small"
                                                    onClick={() => {
                                                        formikEmployee.handleReset();
                                                        setIsEditingEmployee(false);
                                                    }}
                                                    disabled={!isEditingEmployee}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    disabled={
                                                        formikEmployee.isSubmitting ||
                                                        !formikEmployee.isValid ||
                                                        !isEditingEmployee
                                                    }
                                                    type="submit"
                                                >
                                                    {formikEmployee.isSubmitting ? 'Saving...' : 'Save'}
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </Stack>
    );
}
