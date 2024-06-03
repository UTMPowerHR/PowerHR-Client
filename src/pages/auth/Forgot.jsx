import { Button, Card, CardContent, CardHeader, TextField, Box, Stack, Alert } from '@mui/material';
import { useForgotPasswordMutation } from '@features/auth/authApiSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Show from '@components/show';

const ForgotPassword = () => {
    const [forgotPassword, { isLoading: forgotPasswordLoading }] = useForgotPasswordMutation();

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().email('Invalid email address').required('Email is required'),
        }),
        onSubmit: async (values, helpers) => {
            await forgotPassword(values.email)
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
            <Card elevation={16}>
                <CardHeader sx={{ pb: 0 }} title="Forgot password" />
                <CardContent>
                    <Box component="form" noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />

                        <Button
                            fullWidth
                            size="large"
                            sx={{ mt: 3 }}
                            type="submit"
                            variant="contained"
                            disabled={forgotPasswordLoading || !formik.isValid || !formik.dirty}
                        >
                            {forgotPasswordLoading ? 'Sending email...' : 'Send reset link'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Show when={formik.status?.success === true || false}>
                <Stack spacing={2} sx={{ mt: 3 }}>
                    <Alert severity="success">
                        An email has been sent to your email address with further instructions.
                    </Alert>
                </Stack>
            </Show>

            <Show when={formik.status?.success === false}>
                <Stack spacing={2} sx={{ mt: 3 }}>
                    <Alert severity="error">{formik.errors.submit}</Alert>
                </Stack>
            </Show>
        </>
    );
};

export default ForgotPassword;
