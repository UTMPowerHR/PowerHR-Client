import { useActivateAccountMutation, useVerifyTokenQuery } from '@features/auth/authApiSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, Stack, Alert, TextField, IconButton } from '@mui/material';
import { LoadingComponent } from '@components/loading';
import PATHS from '@constants/routes/paths';
import { useEffect } from 'react';
import Show from '@components/show';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import KeyboardCapslockRoundedIcon from '@mui/icons-material/KeyboardCapslockRounded';

const getCharacterValidationError = (str) => {
    return `Your password must have at least 1 ${str} character`;
};

const validationSchema = Yup.object().shape({
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
});

const Activate = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { data, error, isLoading, isSuccess, isError } = useVerifyTokenQuery(token);

    const [activateAccount, { isLoading: isActivating, error: activationError, isError: isActivationError }] =
        useActivateAccountMutation();

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
            password: '',
            confirmPassword: '',
            submit: null,
        },
        validationSchema: validationSchema,
        onSubmit: async (values, helpers) => {
            await await activateAccount({ token, password: values.password, confirmPassword: values.confirmPassword })
                .unwrap()
                .then(() => {
                    navigate(PATHS.AUTH.LOGIN);
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

    useEffect(() => {
        const activateAndRedirect = async () => {
            if (isSuccess && !data.changePassword) {
                // Activate account
                await activateAccount({ token })
                    .unwrap()
                    .then(() => {
                        navigate(PATHS.AUTH.LOGIN);
                    });
            }
        };

        activateAndRedirect();
    }, [isSuccess, token, activateAccount, navigate, data?.changePassword]);

    return (
        <>
            <LoadingComponent isLoading={false || isLoading || isActivating}>
                <Card elevation={16}>
                    <CardHeader sx={{ pb: 0 }} title="Activate Account" />
                    <CardContent>
                        <Show when={isSuccess && data?.changePassword}>
                            <Stack spacing={3}>
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

                                <Button color="primary" variant="contained" fullWidth onClick={formik.submitForm}>
                                    Activate
                                </Button>
                            </Stack>
                        </Show>

                        <Show when={isError || isActivationError || false}>
                            <Stack spacing={3}>
                                <Alert severity="error">
                                    {error?.data?.error || activationError?.data?.error || `Something went wrong!`}
                                </Alert>
                            </Stack>
                        </Show>
                    </CardContent>
                </Card>
            </LoadingComponent>
        </>
    );
};

export default Activate;
