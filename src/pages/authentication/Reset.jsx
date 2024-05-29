import {
    Button,
    Box,
    Card,
    CardContent,
    CardHeader,
    Stack,
    TextField,
    Typography,
    Alert,
    IconButton,
} from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Show from '../../components/show';
import { useState, useEffect } from 'react';
import KeyboardCapslockRoundedIcon from '@mui/icons-material/KeyboardCapslockRounded';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useVerifyTokenQuery, useResetPasswordMutation } from '../../features/authentication/authApiSlice';
import { useSearchParams } from 'react-router-dom';
import { LoadingComponent } from '../../components/loading';
import PATHS from '../../constants/routes/paths';
import { useNavigate } from 'react-router-dom';

const getCharacterValidationError = (str) => {
    return `Your password must have at least 1 ${str} character`;
};

const Reset = () => {
    const [isCapsLockOn, setIsCapsLockOn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');

    const { error, isLoading } = useVerifyTokenQuery(token);

    const [resetPassword, { isLoading: isResetting, isSuccess }] = useResetPasswordMutation();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
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
            password: '',
            confirmPassword: '',
            submit: null,
        },
        validationSchema: Yup.object().shape({
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
        }),
        onSubmit: async (values, helpers) => {
            await resetPassword({ token, password: values.password, confirmPassword: values.confirmPassword })
                .unwrap()
                .then(() => {
                    helpers.setStatus({ success: true });
                    helpers.setSubmitting(false);
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
            <LoadingComponent isLoading={isLoading}>
                <>
                    {isSuccess && (
                        <Card elevation={16}>
                            <CardHeader sx={{ pb: 0 }} title="Reset Password" />

                            <CardContent>
                                <Stack spacing={3}>
                                    <Alert severity="success">Password reset successfully</Alert>
                                </Stack>

                                <Stack spacing={3} sx={{ mt: 3 }}>
                                    <Button
                                        fullWidth
                                        size="large"
                                        variant="contained"
                                        onClick={() => navigate(PATHS.AUTH.LOGIN)}
                                    >
                                        Login
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    )}

                    {error && (
                        <Card elevation={16}>
                            <CardHeader sx={{ pb: 0 }} title="Reset Password" />

                            <CardContent>
                                <Stack spacing={3}>
                                    <Alert severity="error">{error.data.error}</Alert>
                                </Stack>

                                <Stack spacing={3} sx={{ mt: 3 }}>
                                    <Button
                                        fullWidth
                                        size="large"
                                        variant="contained"
                                        onClick={() => navigate(PATHS.AUTH.FORGOT_PASSWORD)}
                                    >
                                        Back to Forgot Password
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    )}

                    {!isSuccess && !error && (
                        <>
                            <Card elevation={16}>
                                <CardHeader
                                    subheader={
                                        <Typography color="text.secondary" variant="body2">
                                            Enter your new password below
                                        </Typography>
                                    }
                                    sx={{ pb: 0 }}
                                    title="Reset Password"
                                />
                                <CardContent>
                                    <Box component="form" noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
                                        <Stack spacing={3}>
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
                                            <TextField
                                                error={
                                                    !!(formik.touched.confirmPassword && formik.errors.confirmPassword)
                                                }
                                                fullWidth
                                                helperText={
                                                    formik.touched.confirmPassword && formik.errors.confirmPassword
                                                }
                                                label="Confirm Password"
                                                name="confirmPassword"
                                                id="confirmPassword"
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={formik.values.confirmPassword}
                                                inputProps={{
                                                    form: {
                                                        autocomplete: 'off',
                                                    },
                                                }}
                                                onClick={(event) => {
                                                    const isCapsLockOn = event.getModifierState('CapsLock');
                                                    setIsCapsLockOn(isCapsLockOn);
                                                }}
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
                                            disabled={!formik.isValid || !formik.dirty || isResetting}
                                        >
                                            {isResetting ? 'Resetting...' : 'Reset Password'}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                            <Show when={formik.errors.submit ? true : false}>
                                <Stack spacing={3} sx={{ mt: 3 }}>
                                    <Alert severity="error">{formik.errors.submit}</Alert>
                                </Stack>
                            </Show>
                        </>
                    )}
                </>
            </LoadingComponent>
        </>
    );
};

export default Reset;
