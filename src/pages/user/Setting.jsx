import {
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    Alert,
    TextField,
    Typography,
    Unstable_Grid2 as Grid,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useChangePasswordMutation } from '@features/auth/authApiSlice';
import { useSelector } from 'react-redux';
import Show from '@components/show';

const getCharacterValidationError = (str) => {
    return `Your password must have at least 1 ${str} character`;
};

export default function Security() {
    const [changePassword] = useChangePasswordMutation();
    const user = useSelector((state) => state.auth.user);

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object().shape({
            oldPassword: Yup.string().required('Current Password is required'),
            newPassword: Yup.string()
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters')
                .matches(/[a-z]/, getCharacterValidationError('lowercase'))
                .matches(/[A-Z]/, getCharacterValidationError('uppercase'))
                .matches(/[0-9]/, getCharacterValidationError('number'))
                .matches(/[^a-zA-Z0-9]/, getCharacterValidationError('special')),
            confirmPassword: Yup.string()
                .required('Confirm Password is required')
                .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
        }),
        onSubmit: async (values, helpers) => {
            await changePassword({ ...values, id: user._id })
                .unwrap()
                .then(() => {
                    helpers.setStatus({ success: true });
                    helpers.resetForm();
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
        <Stack spacing={4}>
            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid xs={12} md={4}>
                            <Typography variant="h6">Change Password</Typography>
                        </Grid>
                        <Grid xs={12} md={8}>
                            <Box component="form" noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
                                <Stack spacing={3}>
                                    <Stack spacing={3}>
                                        <TextField
                                            fullWidth
                                            label="Current Password"
                                            type="password"
                                            {...formik.getFieldProps('oldPassword')}
                                            error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                                            helperText={formik.touched.oldPassword && formik.errors.oldPassword}
                                        />
                                        <TextField
                                            fullWidth
                                            label="New Password"
                                            type="password"
                                            {...formik.getFieldProps('newPassword')}
                                            error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                                            helperText={formik.touched.newPassword && formik.errors.newPassword}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Confirm Password"
                                            type="password"
                                            {...formik.getFieldProps('confirmPassword')}
                                            error={
                                                formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)
                                            }
                                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                        />

                                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                                            <Show when={formik.errors.submit ? true : false}>
                                                <Stack spacing={3} sx={{ mt: 3 }}>
                                                    <Alert severity="error">{formik.errors.submit}</Alert>
                                                </Stack>
                                            </Show>
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                type="submit"
                                                disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
                                            >
                                                Change Password
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Stack>
    );
}
