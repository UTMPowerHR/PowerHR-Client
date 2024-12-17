import { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { setEmployees } from '@features/company/companySlice';
import { Stack, Paper, Typography, Box, Stepper, Step, StepLabel, Button, TextField } from '@mui/material';
import { useGetEmployeesQuery, useGetDepartmentsQuery } from '@features/company/companyApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';

dayjs.extend(utc);
const steps = ['Employee Details', 'Accrual Pay', 'Benefits Pay', 'Gratuity Pay', 'Generate Document'];

function FinalSettlement() {
    const { employeeId } = useParams();  // Get employeeId from the URL
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const user = useSelector((state) => state.auth.user);
    const employees = useSelector((state) => state.company.employees);
    const dispatch = useDispatch();
    const { data, isSuccess } = useGetEmployeesQuery(user.company);
    const { data: departmentsData } = useGetDepartmentsQuery(user.company);
    const [departmentOptions, setDepartmentOptions] = useState([]);

    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());

    useEffect(() => {
        if (isSuccess) {
            dispatch(setEmployees(data.employees));
        }
    }, [data, dispatch, isSuccess]);

    useEffect(() => {
        if (employeeId && employees?.length > 0) {
            const employee = employees.find((employee) => employee._id == employeeId);
            setSelectedEmployee(employee);
        }
    }, [employeeId, employees]);

    useEffect(() => {
        if (departmentsData) {
            setDepartmentOptions(departmentsData.departments);
        }
    }, [departmentsData]);

    const getFullName = () => {
        return selectedEmployee.firstName + " " + selectedEmployee.lastName;
    };

    const getDepartmentName = () => {
        if (selectedEmployee == null) return "";
        const department = departmentOptions.find((dept) => dept._id === selectedEmployee.department);
        return department ? department.name : 'Unknown Department';
    };

    const isStepOptional = (step) => {
        return true;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <>
            <Stack spacing={4}>
                <Typography variant="h4">Manage Final Settlement</Typography>
                <Paper>
                    <Stack spacing={2} sx={{ p: 4 }}>
                        <Typography variant="h5">Employee Details</Typography>
                        <Typography variant="body1">
                            <b>Name: </b> {selectedEmployee ? getFullName() : ""}
                        </Typography>
                        <Typography variant="body1">
                            <b>Email: </b> {selectedEmployee ? selectedEmployee?.email : ""}
                        </Typography>
                        <Typography variant="body1">
                            <b>Department: </b> {getDepartmentName()}
                        </Typography>
                        <Typography variant="body1">
                            <b>Termination Date: </b> {selectedEmployee ? dayjs(selectedEmployee?.terminationDate).format("DD MMMM YYYY") : ""}
                        </Typography>
                    </Stack>
                </Paper>

                <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            if (isStepSkipped(index)) {
                                stepProps.completed = false;
                            }
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <Fragment>
                            <Typography sx={{ mt: 2, mb: 1 }}>
                                All steps completed - you&apos;re finished
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button onClick={handleReset}>Reset</Button>
                            </Box>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Typography sx={{ mt: 4, mb: 2 }} variant="h5"> {steps[activeStep]}</Typography>
                            {/* Enter Code Here Please Don't Forget Hisyam! */}
                            <Paper>
                                <Stack spacing={2} sx={{ p: 4 }}>
                                    <Typography variant="body1">
                                        <TextField
                                            id="filled-read-only-input"
                                            label="Name"
                                            value={selectedEmployee ? getFullName() : ""}
                                            variant="filled"
                                            InputProps={{
                                                readOnly: true, // Makes the field read-only
                                                sx: { fontSize: '2rem', fontWeight: 'bold' } // Bigger text for value
                                            }}
                                            InputLabelProps={{
                                                sx: { fontSize: '1rem', fontWeight: 'bold' } // Smaller text for label
                                            }}
                                        />
                                        <br></br><br></br>
                                        <TextField
                                            id="filled-read-only-input"
                                            label="Email"
                                            value={selectedEmployee ? selectedEmployee.email : ""}
                                            variant="filled"
                                            InputProps={{
                                                readOnly: true, // Makes the field read-only
                                                sx: { fontSize: '2rem', fontWeight: 'bold' } // Bigger text for value
                                            }}
                                            InputLabelProps={{
                                                sx: { fontSize: '1rem', fontWeight: 'bold' } // Smaller text for label
                                            }}
                                        />

                                    </Typography>
                                </Stack>
                            </Paper>

                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Button
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                >
                                    Back
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />
                                {isStepOptional(activeStep) && (
                                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                        Continue
                                    </Button>
                                )}
                                <Button onClick={handleNext}>
                                    {activeStep === steps.length - 1 ? 'Finish' : 'Save'}
                                </Button>
                            </Box>
                        </Fragment>
                    )}
                </Box>
            </Stack>

        </>
    );
}

export default FinalSettlement;
