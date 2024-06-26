import { useSelector } from 'react-redux';
import { useGetCompanyQuery, useUpdateCompanyMutation } from '@features/company/companyApiSlice';
import { Card, Grid, TextField, Typography, Button, Stack } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';

export default function ManageCompany() {
    const userCompanyId = useSelector((state) => state.auth.user.company);
    const { data, isLoading } = useGetCompanyQuery(userCompanyId);
    const [updateCompany] = useUpdateCompanyMutation();

    const [isEditing, setIsEditing] = useState(false);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Company name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phone: Yup.string().required('Phone number is required'),
        address: Yup.object().shape({
            street: Yup.string().required('Street is required'),
            city: Yup.string().required('City is required'),
            state: Yup.string().required('State is required'),
            zip: Yup.string().required('Zip code is required'),
            country: Yup.string().required('Country is required'),
        }),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            address: {
                street: '',
                city: '',
                state: '',
                zip: '',
                country: '',
            },
        },
        validationSchema,
        onSubmit: async (values) => {
            await updateCompany({
                _id: data.company._id,
                name: values.name,
                email: values.email,
                phone: values.phone,
                address: {
                    street: values.address.street,
                    city: values.address.city,
                    state: values.address.state,
                    zip: values.address.zip,
                    country: values.address.country,
                },
            }).then(() => {
                setIsEditing(false);
            });
        },
    });

    useEffect(() => {
        if (data) {
            formik.setValues({
                name: data.company.name,
                email: data.company.email,
                phone: data.company.phone,
                address: {
                    street: data.company.address.street,
                    city: data.company.address.city,
                    state: data.company.address.state,
                    zip: data.company.address.zip,
                    country: data.company.address.country,
                },
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const resetForm = () => {
        formik.setValues({
            name: data.company.name,
            email: data.company.email,
            phone: data.company.phone,
            address: {
                street: data.company.address.street,
                city: data.company.address.city,
                state: data.company.address.state,
                zip: data.company.address.zip,
                country: data.company.address.country,
            },
        });
        setIsEditing(false);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <Grid
                container
                spacing={{
                    xs: 3,
                    lg: 4,
                }}
            >
                <Grid item xs={12}>
                    <Typography variant="h4">Manage Company</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Card sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Company Name"
                                    variant="outlined"
                                    {...formik.getFieldProps('name')}
                                    onChange={(e) => {
                                        formik.setFieldValue('name', e.target.value);
                                        setIsEditing(true);
                                    }}
                                    helperText={formik.touched.name && formik.errors.name}
                                    error={!!formik.touched.name && !!formik.errors.name}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                    {...formik.getFieldProps('email')}
                                    onChange={(e) => {
                                        formik.setFieldValue('email', e.target.value);
                                        setIsEditing(true);
                                    }}
                                    helperText={formik.touched.email && formik.errors.email}
                                    error={!!formik.touched.email && !!formik.errors.email}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    variant="outlined"
                                    {...formik.getFieldProps('phone')}
                                    onChange={(e) => {
                                        formik.setFieldValue('phone', e.target.value);
                                        setIsEditing(true);
                                    }}
                                    helperText={formik.touched.phone && formik.errors.phone}
                                    error={!!formik.touched.phone && !!formik.errors.phone}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Street"
                                    variant="outlined"
                                    {...formik.getFieldProps('address.street')}
                                    onChange={(e) => {
                                        formik.setFieldValue('address.street', e.target.value);
                                        setIsEditing(true);
                                    }}
                                    helperText={formik.touched.address?.street && formik.errors.address?.street}
                                    error={!!formik.touched.address?.street && !!formik.errors.address?.street}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    variant="outlined"
                                    {...formik.getFieldProps('address.city')}
                                    onChange={(e) => {
                                        formik.setFieldValue('address.city', e.target.value);
                                        setIsEditing(true);
                                    }}
                                    helperText={formik.touched.address?.city && formik.errors.address?.city}
                                    error={!!formik.touched.address?.city && !!formik.errors.address?.city}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="State"
                                    variant="outlined"
                                    {...formik.getFieldProps('address.state')}
                                    onChange={(e) => {
                                        formik.setFieldValue('address.state', e.target.value);
                                        setIsEditing(true);
                                    }}
                                    helperText={formik.touched.address?.state && formik.errors.address?.state}
                                    error={!!formik.touched.address?.state && !!formik.errors.address?.state}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Zip"
                                    variant="outlined"
                                    {...formik.getFieldProps('address.zip')}
                                    onChange={(e) => {
                                        formik.setFieldValue('address.zip', e.target.value);
                                        setIsEditing(true);
                                    }}
                                    helperText={formik.touched.address?.zip && formik.errors.address?.zip}
                                    error={!!formik.touched.address?.zip && !!formik.errors.address?.zip}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Country"
                                    variant="outlined"
                                    {...formik.getFieldProps('address.country')}
                                    onChange={(e) => {
                                        formik.setFieldValue('address.country', e.target.value);
                                        setIsEditing(true);
                                    }}
                                    helperText={formik.touched.address?.country && formik.errors.address?.country}
                                    error={!!formik.touched.address?.country && !!formik.errors.address?.country}
                                />
                            </Grid>
                        </Grid>
                        <Stack direction="row" spacing={2} sx={{ mt: 2 }} justifyContent="flex-end">
                            <Button variant="contained" onClick={resetForm}>
                                Cancel
                            </Button>
                            <Button variant="contained" onClick={formik.handleSubmit} disabled={!isEditing}>
                                Save
                            </Button>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
