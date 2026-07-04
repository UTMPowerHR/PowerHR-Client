import React, { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { setEmployees } from '@features/company/companySlice';
import {
    Stack,
    Paper,
    Typography,
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    TextField,
    Grid,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
} from '@mui/material';
import { useGetEmployeesQuery, useGetDepartmentsQuery } from '@features/company/companyApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import SettlementDocument from './components/settlementDocument';
import { PDFDownloadLink } from '@react-pdf/renderer';

dayjs.extend(utc);

const steps = ['Employee Details', 'Accrual Pay', 'Benefits Pay', 'Gratuity Pay', 'Generate Document'];

// Component for Accrual Pay calculation
const AccrualPayStep = ({ selectedEmployee, onCalculate }) => {
    const [basicSalary, setBasicSalary] = useState(selectedEmployee?.salary || 0);
    const [unusedLeaves, setUnusedLeaves] = useState(0);
    const [accrualAmount, setAccrualAmount] = useState(0);

    useEffect(() => {
        const dailyRate = basicSalary / 30;
        const newAccrualAmount = dailyRate * unusedLeaves;
        setAccrualAmount(newAccrualAmount);
        onCalculate({ basicSalary, accrualAmount: newAccrualAmount });
    }, [basicSalary, unusedLeaves, onCalculate]);

    return (
        <Paper>
            <Stack spacing={3} sx={{ p: 4 }}>
                <Typography variant="h6">Accrual Pay Calculation</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Basic Salary"
                            type="number"
                            value={basicSalary}
                            onChange={(e) => setBasicSalary(Number(e.target.value))}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Unused Leave Days"
                            type="number"
                            value={unusedLeaves}
                            onChange={(e) => setUnusedLeaves(Number(e.target.value))}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            Total Accrual Amount: ${accrualAmount.toFixed(2)}
                        </Typography>
                    </Grid>
                </Grid>
            </Stack>
        </Paper>
    );
};

// Component for Benefits Pay calculation
const BenefitsPayStep = ({ selectedEmployee, onCalculate }) => {
    const [benefits, setBenefits] = useState([
        { name: 'Health Insurance', amount: 0 },
        { name: 'Transport Allowance', amount: 0 },
        { name: 'Housing Allowance', amount: 0 }
    ]);
    const [totalBenefits, setTotalBenefits] = useState(0);

    useEffect(() => {
        const sum = benefits.reduce((sum, benefit) => sum + benefit.amount, 0);
        setTotalBenefits(sum);
        onCalculate({ totalBenefits, benefits });
    }, [benefits, onCalculate]);

    return (
        <Paper>
            <Stack spacing={3} sx={{ p: 4 }}>
                <Typography variant="h6">Benefits Pay Calculation</Typography>
                <Grid container spacing={3}>
                    {benefits.map((benefit, index) => (
                        <Grid item xs={12} md={6} key={benefit.name}>
                            <TextField
                                fullWidth
                                label={benefit.name}
                                type="number"
                                value={benefit.amount}
                                onChange={(e) => {
                                    const newBenefits = [...benefits];
                                    newBenefits[index].amount = Number(e.target.value);
                                    setBenefits(newBenefits);
                                }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                                }}
                            />
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            Total Benefits Amount: ${totalBenefits.toFixed(2)}
                        </Typography>
                    </Grid>
                </Grid>
            </Stack>
        </Paper>
    );
};

// Component for Gratuity Pay calculation
const GratuityPayStep = ({ selectedEmployee, onCalculate }) => {
    const [yearsOfService, setYearsOfService] = useState(0);
    const [basicSalary, setBasicSalary] = useState(selectedEmployee?.salary || 0);
    const [gratuityAmount, setGratuityAmount] = useState(0);

    useEffect(() => {
        let rate = yearsOfService < 5 ? 0.5 : 1;
        const dailyRate = basicSalary / 30;
        const newGratuityAmount = dailyRate * rate * yearsOfService * 30;
        setGratuityAmount(newGratuityAmount);
        onCalculate({ gratuityAmount: newGratuityAmount });
    }, [yearsOfService, basicSalary, onCalculate]);

    return (
        <Paper>
            <Stack spacing={3} sx={{ p: 4 }}>
                <Typography variant="h6">Gratuity Pay Calculation</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Years of Service"
                            type="number"
                            value={yearsOfService}
                            onChange={(e) => setYearsOfService(Number(e.target.value))}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Basic Salary"
                            type="number"
                            value={basicSalary}
                            onChange={(e) => setBasicSalary(Number(e.target.value))}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            Total Gratuity Amount: ${gratuityAmount.toFixed(2)}
                        </Typography>
                    </Grid>
                </Grid>
            </Stack>
        </Paper>
    );
};

// Component for Document Generation
const GenerateDocumentStep = ({ selectedEmployee, calculations, department }) => {
    const [showPreview, setShowPreview] = useState(false);
    const [documentData, setDocumentData] = useState(null);

    const prepareDocumentData = () => {
        const data = {
            employeeData: {
                fullName: `${selectedEmployee?.firstName} ${selectedEmployee?.lastName}`,
                employeeId: selectedEmployee?._id,
                department: department,
                terminationDate: dayjs(selectedEmployee?.terminationDate).format("DD MMMM YYYY"),
            },
            calculations: {
                basicSalary: calculations?.basicSalary || 0,
                accrualAmount: calculations?.accrualAmount || 0,
                totalBenefits: calculations?.totalBenefits || 0,
                gratuityAmount: calculations?.gratuityAmount || 0,
                benefits: calculations?.benefits || []
            }
        };
        setDocumentData(data);
        setShowPreview(true);
    };

    return (
        <Paper>
            <Stack spacing={3} sx={{ p: 4 }}>
                <Typography variant="h6">Final Settlement Summary</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            Employee Name: {selectedEmployee?.firstName} {selectedEmployee?.lastName}
                        </Typography>
                        <Typography variant="body1">
                            Termination Date: {dayjs(selectedEmployee?.terminationDate).format("DD MMMM YYYY")}
                        </Typography>
                        <Typography variant="body1">
                            Department: {department}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={prepareDocumentData}
                            sx={{ mr: 2 }}
                        >
                            Preview Document
                        </Button>
                        {documentData && (
                            <PDFDownloadLink
                                document={<SettlementDocument {...documentData} />}
                                fileName={`settlement-${selectedEmployee?._id}.pdf`}
                            >
                                {({ loading }) => (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Preparing Download...' : 'Download PDF'}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        )}
                    </Grid>
                </Grid>

                <Dialog
                    open={showPreview}
                    onClose={() => setShowPreview(false)}
                    maxWidth="md"
                    fullWidth
                    sx={{
                        '& .MuiDialog-paper': {
                            color: '#fff',
                        },
                    }}
                >
                    <DialogTitle>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 'bold',
                                color: '#fff',
                                paddingTop: '15px',
                            }}
                        >
                            Document Preview
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        {documentData && (
                            <Box sx={{ mt: 2 }}>
                                {/* Final Settlement Statement */}
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                                    Final Settlement Statement
                                </Typography>

                                {/* Employee Information */}
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        color: '#aaa',
                                        mb: 1,
                                    }}
                                >
                                    Employee Information
                                </Typography>
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={6}>
                                        <Typography><strong>Name:</strong> {documentData.employeeData.fullName}</Typography>
                                        <Typography><strong>Employee ID:</strong> {documentData.employeeData.employeeId}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography><strong>Department:</strong> {documentData.employeeData.department}</Typography>
                                        <Typography><strong>Termination Date:</strong> {documentData.employeeData.terminationDate}</Typography>
                                    </Grid>
                                </Grid>

                                {/* Settlement Summary */}
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        color: '#aaa',
                                        mb: 1,
                                    }}
                                >
                                    Settlement Summary
                                </Typography>
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={6}>
                                        <Typography>Basic Salary: ${documentData.calculations.basicSalary.toFixed(2)}</Typography>
                                        <Typography>Accrued Leave: ${documentData.calculations.accrualAmount.toFixed(2)}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>Benefits: ${documentData.calculations.totalBenefits.toFixed(2)}</Typography>
                                        <Typography>Gratuity: ${documentData.calculations.gratuityAmount.toFixed(2)}</Typography>
                                    </Grid>
                                </Grid>

                                {/* Total Settlement */}
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mt: 3,
                                        paddingTop: '30px',
                                        borderRadius: '4px',
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Total Settlement: ${(
                                        documentData.calculations.basicSalary +
                                        documentData.calculations.accrualAmount +
                                        documentData.calculations.totalBenefits +
                                        documentData.calculations.gratuityAmount
                                    ).toFixed(2)}
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ padding: '20px' }}>
                        <Button
                            onClick={() => setShowPreview(false)}
                            variant="contained"
                            color="primary"
                            sx={{ textTransform: 'none' }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Stack>
        </Paper>
    );
};


function FinalSettlement() {
    const { employeeId } = useParams();
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const user = useSelector((state) => state.auth.user);
    const employees = useSelector((state) => state.company.employees);
    const dispatch = useDispatch();
    const { data, isSuccess } = useGetEmployeesQuery(user?.company);
    const { data: departmentsData } = useGetDepartmentsQuery(user?.company);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [calculations, setCalculations] = useState({
        basicSalary: 0,
        accrualAmount: 0,
        totalBenefits: 0,
        gratuityAmount: 0,
        benefits: []
    });

    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());

    useEffect(() => {
        if (isSuccess && data?.employees) {
            dispatch(setEmployees(data.employees));
        }
    }, [data, dispatch, isSuccess]);

    useEffect(() => {
        if (employeeId && employees?.length > 0) {
            const employee = employees.find((emp) => emp._id === employeeId);
            setSelectedEmployee(employee || null);
        }
    }, [employeeId, employees]);

    useEffect(() => {
        if (departmentsData?.departments) {
            setDepartmentOptions(departmentsData.departments);
        }
    }, [departmentsData]);

    const getFullName = () => {
        if (!selectedEmployee) return "";
        return `${selectedEmployee.firstName || ''} ${selectedEmployee.lastName || ''}`.trim();
    };

    const getDepartmentName = () => {
        if (!selectedEmployee?.department) return "Unknown Department";
        const department = departmentOptions.find((dept) => dept._id === selectedEmployee.department);
        return department?.name || 'Unknown Department';
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

    const renderStepContent = (step) => {

        const handleCalculationsUpdate = (stepCalculations) => {
            setCalculations(prevCalculations => ({
                ...prevCalculations,
                ...stepCalculations
            }));
        };

        switch (step) {
            case 0:
                return (
                    <Paper>
                        <Stack spacing={2} sx={{ p: 4 }}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={getFullName()}
                                variant="filled"
                                InputProps={{
                                    readOnly: true,
                                    sx: { fontSize: '1.25rem' }
                                }}
                            />
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={selectedEmployee?.email || ""}
                                    variant="filled"
                                    InputProps={{
                                        readOnly: true,
                                        sx: { fontSize: '1.25rem' }
                                    }}
                                />
                            </Box>
                        </Stack>
                    </Paper>
                );
            case 1:
                return <AccrualPayStep selectedEmployee={selectedEmployee}
                    onCalculate={handleCalculationsUpdate} />;
            case 2:
                return <BenefitsPayStep selectedEmployee={selectedEmployee}
                    onCalculate={handleCalculationsUpdate} />;
            case 3:
                return <GratuityPayStep selectedEmployee={selectedEmployee}
                    onCalculate={handleCalculationsUpdate} />;
            case 4:
                return <GenerateDocumentStep selectedEmployee={selectedEmployee} calculations={calculations}
                    department={getDepartmentName()} />;
            default:
                return null;
        }
    };

    return (
        <Stack spacing={4}>
            <Typography variant="h4">Manage Final Settlement</Typography>
            <Paper>
                <Stack spacing={2} sx={{ p: 4 }}>
                    <Typography variant="h5">Employee Details</Typography>
                    <Typography variant="body1">
                        <b>Name: </b> {getFullName()}
                    </Typography>
                    <Typography variant="body1">
                        <b>Email: </b> {selectedEmployee?.email || ""}
                    </Typography>
                    <Typography variant="body1">
                        <b>Department: </b> {getDepartmentName()}
                    </Typography>
                    <Typography variant="body1">
                        <b>Termination Date: </b>
                        {selectedEmployee?.terminationDate
                            ? dayjs(selectedEmployee.terminationDate).format("DD MMMM YYYY")
                            : ""}
                    </Typography>
                </Stack>
            </Paper>

            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps = {
                            completed: isStepSkipped(index) ? false : activeStep > index
                        };
                        const labelProps = {
                            optional: isStepOptional(index) ? (
                                <Typography variant="caption">Optional</Typography>
                            ) : null
                        };

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
                        <Typography sx={{ mt: 4, mb: 2 }} variant="h5">{steps[activeStep]}</Typography>
                        {renderStepContent(activeStep)}
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
                                    Skip
                                </Button>
                            )}
                            <Button onClick={handleNext}>
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </Box>
                    </Fragment>
                )}
            </Box>
        </Stack>
    );
}

export default FinalSettlement;