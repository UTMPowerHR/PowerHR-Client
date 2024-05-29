import {
    Button,
    Box,
    Card,
    CardContent,
    CardHeader,
    Stack,
    TextField,
    Typography,
    Link,
    Alert,
    IconButton,
} from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import PATHS from '../../constants/routes/paths';
import Show from '../../components/show';
import { useState, useEffect } from 'react';
import KeyboardCapslockRoundedIcon from '@mui/icons-material/KeyboardCapslockRounded';
import { useLoginMutation } from '../../features/authentication/authApiSlice';
import { setCredentials } from '../../features/authentication/authSlice';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch } from 'react-redux';

const Login = () => {
    const [isCapsLockOn, setIsCapsLockOn] = useState(false);
    const dispatch = useDispatch();
    const [login, { isLoading: loginLoading }] = useLoginMutation();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        const handleKeyUp = (event) => {
            if (event instanceof KeyboardEvent) {
                setIsCapsLockOn(event.getModifierState('CapsLock'));
            }
        };

        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values, helpers) => {
            await login({
                email: values.email,
                password: values.password,
            })
                .unwrap()
                .then((data) => {
                    dispatch(setCredentials(data));
                    navigate(PATHS.DASHBOARD.INDEX);
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
                            Don&apos;t have an account? &nbsp;
                            <Link component="a" href={PATHS.AUTH.REGISTER} underline="hover" variant="subtitle2">
                                Register
                            </Link>
                        </Typography>
                    }
                    sx={{ pb: 0 }}
                    title="Log in"
                />
                <CardContent>
                    <Box component="form" noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
                        <Stack spacing={3}>
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
                                id="password"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                type={showPassword ? 'text' : 'password'}
                                value={formik.values.password}
                                onClick={(event) => {
                                    const isCapsLockOn = event.getModifierState('CapsLock');
                                    setIsCapsLockOn(isCapsLockOn);
                                }}
                                inputProps={{
                                    form: {
                                        autocomplete: 'off',
                                    },
                                }}
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
                        </Stack>

                        <Button
                            fullWidth
                            size="large"
                            sx={{ mt: 2 }}
                            type="submit"
                            variant="contained"
                            disabled={loginLoading || !formik.isValid || !formik.dirty}
                        >
                            Log In
                        </Button>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 3,
                            }}
                        >
                            <Link component="a" href={PATHS.AUTH.FORGOT_PASSWORD} underline="hover" variant="subtitle2">
                                Forgot password?
                            </Link>
                        </Box>
                    </Box>
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

export default Login;
