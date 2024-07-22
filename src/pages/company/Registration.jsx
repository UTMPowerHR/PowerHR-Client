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
    Stepper,
    Step,
    StepLabel,
    CircularProgress,
    InputAdornment,
    Alert,
} from '@mui/material';
import Show from '@components/show';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useCheckCompanyMutation, useRegisterCompanyMutation } from '@features/company/companyApiSlice';
import PATHS from '@constants/routes/paths';

const steps = ['Company Details', 'Address', 'Activate'];

const Registration = () => {
    const [checkCompany, { isLoading: isCheckingCompany, data: companyData }] = useCheckCompanyMutation();
    const [registerCompany, { isLoading: isRegisteringCompany }] = useRegisterCompanyMutation();

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
        policy: Yup.bool().oneOf([true], 'You must accept the terms and conditions'),
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
            policy: false,
            submit: null,
        },
        validationSchema: validationSchema,
        onSubmit: async (values, helpers) => {
            await registerCompany(values)
                .unwrap()
                .then(() => {
                    handleComplete();
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

    const [prevEmail, setPrevEmail] = useState('');

    useEffect(() => {
        const checkCompanyData = async () => {
            if (formik.values.email !== prevEmail) {
                setPrevEmail(formik.values.email);

                if (!formik.errors.email) await checkCompany({ email: formik.values.email });
            }
        };

        checkCompanyData();
    }, [formik.values.email, prevEmail, checkCompany, formik.errors.email]);

    const validateStep = (step) => {
        switch (step) {
            case 0:
                return !formik.errors.name && !formik.errors.email && !formik.errors.phone && formik.dirty;
            case 1:
                return (
                    !formik.errors.address?.street &&
                    !formik.errors.address?.city &&
                    !formik.errors.address?.state &&
                    !formik.errors.address?.zip &&
                    !formik.errors.address?.country &&
                    !formik.errors.policy &&
                    formik.dirty
                );
            default:
                return false;
        }
    };

    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState({});

    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 2;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                  // find the first step that has been completed
                  steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleComplete = () => {
        if (validateStep(activeStep)) {
            const newCompleted = completed;
            newCompleted[activeStep] = true;
            setCompleted(newCompleted);
            handleNext();
        }
    };

    return (
        <>
            <Card elevation={16}>
                <CardHeader
                    sx={{ pb: 0 }}
                    subheader={
                        <Typography variant="body2">Please fill in the form below to register your company.</Typography>
                    }
                    title="Company Registration"
                />

                <CardContent>
                    <Box sx={{ mb: 3 }}>
                        <Stepper alternativeLabel activeStep={activeStep}>
                            {steps.map((label, index) => (
                                <Step key={label} completed={completed[index]}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>

                    <Box component="form" onSubmit={formik.handleSubmit} noValidate autoComplete="off">
                        {activeStep === 0 && (
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="Company Name"
                                    variant="outlined"
                                    {...formik.getFieldProps('name')}
                                    helperText={formik.touched.name && formik.errors.name}
                                    error={!!formik.touched.name && !!formik.errors.name}
                                />

                                <TextField
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                    {...formik.getFieldProps('email')}
                                    helperText={formik.touched.email && formik.errors.email}
                                    error={!!formik.touched.email && !!formik.errors.email}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {/* if email is empty then show nothing */}
                                                {formik.values.email && isCheckingCompany && !formik.errors.email && (
                                                    <CircularProgress size={20} />
                                                )}

                                                {formik.values.email &&
                                                    companyData?.exists &&
                                                    !isCheckingCompany &&
                                                    !formik.errors.email && <ErrorIcon color="error" />}

                                                {formik.values.email &&
                                                    !companyData?.exists &&
                                                    !isCheckingCompany &&
                                                    !formik.errors.email && <CheckCircleIcon color="success" />}
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Phone"
                                    variant="outlined"
                                    {...formik.getFieldProps('phone')}
                                    helperText={formik.touched.phone && formik.errors.phone}
                                    error={!!formik.touched.phone && !!formik.errors.phone}
                                />
                            </Stack>
                        )}

                        {activeStep === 1 && (
                            <>
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label="Street"
                                        variant="outlined"
                                        {...formik.getFieldProps('address.street')}
                                        helperText={formik.touched.address?.street && formik.errors.address?.street}
                                        error={!!formik.touched.address?.street && !!formik.errors.address?.street}
                                    />

                                    <TextField
                                        fullWidth
                                        label="City"
                                        variant="outlined"
                                        {...formik.getFieldProps('address.city')}
                                        helperText={formik.touched.address?.city && formik.errors.address?.city}
                                        error={!!formik.touched.address?.city && !!formik.errors.address?.city}
                                    />

                                    <TextField
                                        fullWidth
                                        label="State"
                                        variant="outlined"
                                        {...formik.getFieldProps('address.state')}
                                        helperText={formik.touched.address?.state && formik.errors.address?.state}
                                        error={!!formik.touched.address?.state && !!formik.errors.address?.state}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Zip"
                                        variant="outlined"
                                        {...formik.getFieldProps('address.zip')}
                                        helperText={formik.touched.address?.zip && formik.errors.address?.zip}
                                        error={!!formik.touched.address?.zip && !!formik.errors.address?.zip}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Country"
                                        variant="outlined"
                                        {...formik.getFieldProps('address.country')}
                                        helperText={formik.touched.address?.country && formik.errors.address?.country}
                                        error={!!formik.touched.address?.country && !!formik.errors.address?.country}
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
                                    <Checkbox
                                        checked={formik.values.policy}
                                        name="policy"
                                        onChange={formik.handleChange}
                                    />
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
                            </>
                        )}

                        {steps[activeStep] !== 'Activate' && (
                            <Box sx={{ mt: 3 }}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Button variant="contained" disabled={activeStep === 0} onClick={handleBack}>
                                        Back
                                    </Button>

                                    {activeStep === steps.length - 2 ? (
                                        <Button
                                            variant="contained"
                                            onClick={formik.handleSubmit}
                                            disabled={!formik.isValid || formik.isSubmitting}
                                        >
                                            {isRegisteringCompany ? <CircularProgress size={20} /> : 'Register'}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            onClick={handleComplete}
                                            disabled={!validateStep(activeStep)}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </Stack>
                            </Box>
                        )}

                        {steps[activeStep] === 'Activate' && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="body2" textAlign="center">
                                    Your company has been successfully registered. Please check your email to activate
                                    your account.
                                </Typography>

                                <Button variant="contained" sx={{ mt: 2 }} fullWidth href={PATHS.AUTH.LOGIN}>
                                    Login
                                </Button>
                            </Box>
                        )}
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

export default Registration;
