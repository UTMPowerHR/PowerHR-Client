import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Stack,
    TextField,
    Typography,
    Link,
    FormHelperText,
    Alert,
    IconButton,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useRegisterApplicantMutation } from '../../features/applicant/applicantApiSlice';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import KeyboardCapslockRoundedIcon from '@mui/icons-material/KeyboardCapslockRounded';
import PATHS from '../../constants/routes/paths';
import Show from '../../components/show';
import { useState, useEffect } from 'react';

const getCharacterValidationError = (str) => {
    return `Your password must have at least 1 ${str} character`;
};

const validationSchema = Yup.object().shape({
    firstName: Yup.string().max(255).required('First name is required'),
    lastName: Yup.string().max(255).required('Last name is required'),
    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, getCharacterValidationError('lowercase'))
        .matches(/[A-Z]/, getCharacterValidationError('uppercase'))
        .matches(/[0-9]/, getCharacterValidationError('number'))
        .matches(/[^a-zA-Z0-9]/, getCharacterValidationError('special')),
    confirmPassword: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref('password')], 'Passwords must match'),
    policy: Yup.boolean().oneOf([true], 'This field must be checked'),
    gender: Yup.string().required('Gender is required'),
});

const Register = () => {
    const [register] = useRegisterApplicantMutation();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isCapsLockOn, setIsCapsLockOn] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        const handleKeyUp = (event) => {
            setIsCapsLockOn(event.getModifierState('CapsLock'));
        };

        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            gender: '',
            confirmPassword: '',
            policy: false,
            submit: null,
        },
        validationSchema: validationSchema,
        onSubmit: async (values, helpers) => {
            await register({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                gender: values.gender,
                password: values.password,
                confirmPassword: values.confirmPassword,
            })
                .unwrap()
                .then(() => {
                    helpers.setStatus({ success: true });
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
        },
    });

    return (
        <>
            <Card elevation={16}>
                <CardHeader
                    subheader={
                        <Typography color="text.secondary" variant="body2">
                            Already have an account? &nbsp;
                            <Link component="a" href={PATHS.AUTH.LOGIN} underline="hover" variant="subtitle2">
                                Log In
                            </Link>
                        </Typography>
                    }
                    sx={{ pb: 0 }}
                    title="Register"
                />
                <CardContent>
                    <Show when={formik.status?.success === true}>
                        <Stack spacing={3}>
                            <Alert severity="success">Check your email to verify your account</Alert>
                            <Button
                                color="primary"
                                fullWidth
                                size="large"
                                variant="contained"
                                onClick={() => navigate(PATHS.AUTH.LOGIN)}
                            >
                                Log In
                            </Button>
                        </Stack>
                    </Show>

                    <Show when={formik.status?.success !== true}>
                        <Box component="form" noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
                            <Stack spacing={3}>
                                <Stack spacing={3} direction={{ xs: 'column', sm: 'row' }}>
                                    <TextField
                                        error={!!(formik.touched.firstName && formik.errors.firstName)}
                                        fullWidth
                                        helperText={formik.touched.firstName && formik.errors.firstName}
                                        label="First Name"
                                        name="firstName"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
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
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.lastName}
                                    />
                                </Stack>

                                <FormControl
                                    variant="filled"
                                    fullWidth
                                    error={!!(formik.touched.gender && formik.errors.gender)}
                                    helperText={formik.touched.gender && formik.errors.gender}
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
                                    error={!!(formik.touched.email && formik.errors.email)}
                                    fullWidth
                                    helperText={formik.touched.email && formik.errors.email}
                                    label="Email Address"
                                    name="email"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="email"
                                    value={formik.values.email}
                                />
                                <TextField
                                    error={!!(formik.touched.password && formik.errors.password)}
                                    fullWidth
                                    helperText={formik.touched.password && formik.errors.password}
                                    label="Password"
                                    name="password"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type={showPassword ? 'text' : 'password'}
                                    value={formik.values.password}
                                    InputProps={{
                                        endAdornment: (
                                            <>
                                                <Show when={isCapsLockOn}>
                                                    <KeyboardCapslockRoundedIcon color="action" />
                                                </Show>
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </>
                                        ),
                                    }}
                                />
                                <TextField
                                    error={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                                    fullWidth
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formik.values.confirmPassword}
                                    InputProps={{
                                        endAdornment: (
                                            <>
                                                <Show when={isCapsLockOn}>
                                                    <KeyboardCapslockRoundedIcon color="action" />
                                                </Show>
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowConfirmPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </>
                                        ),
                                    }}
                                />
                            </Stack>
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    ml: -1,
                                    mt: 1,
                                }}
                            >
                                <Checkbox checked={formik.values.policy} name="policy" onChange={formik.handleChange} />
                                <Typography color="text.secondary" variant="body2">
                                    I have read the{' '}
                                    <Link component="a" href="#">
                                        Terms and Conditions
                                    </Link>
                                </Typography>
                            </Box>
                            <Show when={!!(formik.touched.policy && formik.errors.policy)}>
                                <FormHelperText error>{formik.errors.policy}</FormHelperText>
                            </Show>

                            <Button
                                fullWidth
                                size="large"
                                sx={{ mt: 2 }}
                                type="submit"
                                variant="contained"
                                disabled={formik.isSubmitting || !formik.dirty || !formik.isValid}
                            >
                                {formik.isSubmitting ? 'Registering...' : 'Register'}
                            </Button>
                        </Box>
                    </Show>
                </CardContent>
            </Card>
            <Show when={formik.errors.submit ? true : false}>
                <Stack spacing={3} sx={{ mt: 3 }}>
                    <Alert severity="error">{formik.errors.submit}</Alert>
                </Stack>
            </Show>
        </>
    );
};

export default Register;
