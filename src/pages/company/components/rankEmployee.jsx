import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    IconButton,
    Select,
    Stack,
    OutlinedInput,
    Typography,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Checkbox,
} from '@mui/material';
import {
    useGetEmployeesQuery,
    useUpdateEmployeeMutation,
    useGetDepartmentsQuery,
    useConvertApplicantToEmployeeMutation,
} from '@features/company/companyApiSlice';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import determineRole from './roleHierarchy';
import { setEmployees } from '@features/company/companySlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import {
    useGetAllResumesQuery,
} from '@features/resume/resumeApiSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Helper function to calculate education level score
const calculateEducationScore = (resume) => {
    // Assign scores based on education level
    const educationScores = {
        'Bachelor': 3,
        'Master': 4,
        'MBA': 4,
        'PhD': 5
    };

    // Find the highest education level
    const highestDegree = resume?.education?.value?.reduce((highest, edu) => {
        // Extract degree type, handling full degree names
        const degreeType = edu.degree.includes('Master') ? 'Master'
            : edu.degree.includes('MBA') ? 'MBA'
                : edu.degree.includes('Bachelor') ? 'Bachelor'
                    : edu.degree.includes('PhD') ? 'PhD'
                        : 'Bachelor';

        const currentScore = educationScores[degreeType] || 3;
        const highestScore = educationScores[highest] || 3;
        return currentScore > highestScore ? degreeType : highest;
    }, 'Bachelor');

    return educationScores[highestDegree] || 3;
};

// Helper function to calculate language proficiency score
const calculateLanguageScore = (resume) => {
    const languageProficiencyScores = {
        'Beginner': 1,
        'Intermediate': 2,
        'Advanced': 3,
        'Fluent': 4,
        'Native': 5
    };

    const languages = resume?.languages?.value || [];

    // Calculate average language proficiency
    const avgLanguageScore = languages.length > 0
        ? languages.reduce((sum, lang) =>
            sum + (languageProficiencyScores[lang.level] || 2), 0) / languages.length
        : 2;

    return Math.min(5, avgLanguageScore);
};

// Helper function to calculate years of experience
const calculateYearsOfExperience = (resume) => {
    if (!resume?.experience?.value?.length) return 0;

    // Calculate total years of experience
    return resume.experience.value.reduce((totalYears, exp) => {
        // Parse dates and calculate difference
        const fromDate = dayjs(exp.date.from);
        const toDate = exp.date.to === 'Present'
            ? dayjs()
            : dayjs(exp.date.to);

        return totalYears + toDate.diff(fromDate, 'year');
    }, 0);
};

// Helper function to calculate location fit score
const calculateLocationFitScore = (employee, resume, departmentsData) => {
    // Find the department's location
    const department = departmentsData?.departments
        ?.find(dept => dept._id === employee.department);

    const departmentLocation = department?.location || '';
    const resumeLocation = resume?.basicDetail?.location || '';

    // Simple scoring logic
    if (departmentLocation === resumeLocation) return 5; // Perfect match
    if (departmentLocation.split(',')[0] === resumeLocation.split(',')[0]) return 3; // Same city/region
    return 1; // Different location
};

// Helper function to extract technical skills
const calculateTechnicalSkillsScore = (resume) => {
    // If technical skills are empty, return a neutral score
    const technicalSkills = resume?.technicalSkills?.value || [];

    // Simple scoring based on number of skills
    return Math.min(5, Math.max(1, technicalSkills.length));
};

// Helper function to extract soft skills
const calculateSoftSkillsScore = (resume) => {
    // If technical skills are empty, return a neutral score
    const softSkills = resume?.softSkills?.value || [];

    // Simple scoring based on number of skills
    return Math.min(5, Math.max(1, softSkills.length));
};

function performTOPSISAnalysis(filteredEmployees, departmentsData, selectedRole, selectedDepartment, allResumes, dynamicCriteria) {
    selectedRole == "All Roles" ? selectedRole = '' : selectedRole = selectedRole;
    // Filter out unselected criteria
    const selectedCriteria = dynamicCriteria.filter(criterion => criterion.selected);

    // Validate total weight
    const totalWeight = selectedCriteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    if (Math.abs(totalWeight - 1) > 0.01) {
        throw new Error('Total weight must sum to 1');
    }


    // Additional filtering by role and department
    if (selectedRole) {
        filteredEmployees = filteredEmployees.filter(emp => emp.jobTitle === selectedRole);
    }

    if (selectedDepartment) {
        filteredEmployees = filteredEmployees.filter(emp =>
            departmentsData?.departments
                .find(dept => dept.name === selectedDepartment)?._id === emp.department
        );
    }

    // TOPSIS Criteria Definition with new weights
    // Initial criteria definition

    const criteria = selectedCriteria.map(criterion => ({
        name: criterion.key,
        weight: criterion.weight,
        type: 'benefit',
        calculate: criterion.calculate
    }));

    // Step 2: Normalize Data
    const normalizeData = (data) => {
        const normalized = data.map(employee => {
            // Find matching resume
            const matchedResume = allResumes?.find(resume => resume.user === employee._id);

            // Calculate values for each criterion
            const calculatedValues = {};
            criteria.forEach(criterion => {
                calculatedValues[criterion.name] = criterion.calculate(employee, matchedResume);
            });

            return {
                ...employee,
                ...calculatedValues,
                resume: matchedResume
            };
        });

        // Calculate min and max for normalization
        const criteriaValues = {};
        criteria.forEach(criterion => {
            const values = normalized.map(e => e[criterion.name]);
            criteriaValues[criterion.name] = {
                min: Math.min(...values),
                max: Math.max(...values)
            };
        });

        // Normalize values
        return normalized.map(employee => {
            const normalizedValues = {};

            criteria.forEach(criterion => {
                const { min, max } = criteriaValues[criterion.name];
                const value = employee[criterion.name];

                // Normalize benefit criteria
                let normalizedValue = (value - min) / (max - min);

                // Ensure normalized value is between 0 and 1
                normalizedValue = Math.max(0, Math.min(1, normalizedValue));

                // Apply weight to normalized value
                normalizedValues[criterion.name + 'Normalized'] = normalizedValue * criterion.weight;
            });

            return { ...employee, ...normalizedValues };
        });
    };

    // Step 3: Calculate TOPSIS Scores
    const calculateTOPSISScore = (normalizedData) => {

        // If there's only one employee, automatically return 100%
        if (normalizedData.length === 1) {
            return normalizedData.map(employee => ({
                ...employee,
                topisisScore: 1, // 100%
            }));
        }

        return normalizedData.map(employee => {
            const positiveIdealDistance = Math.sqrt(
                criteria.reduce((sum, criterion) => {
                    const normalizedValue = employee[criterion.name + 'Normalized'] || 0;
                    return sum + Math.pow(1 - normalizedValue, 2);
                }, 0)
            );

            const negativeIdealDistance = Math.sqrt(
                criteria.reduce((sum, criterion) => {
                    const normalizedValue = employee[criterion.name + 'Normalized'] || 0;
                    return sum + Math.pow(0 - normalizedValue, 2);
                }, 0)
            );

            const topisisScore = negativeIdealDistance / (positiveIdealDistance + negativeIdealDistance);

            return {
                ...employee,
                topisisScore: isNaN(topisisScore) ? 0 : topisisScore,
                // Include calculated criterion values for transparency
                yearsOfExperienceDetail: employee.yearsOfExperience,
                educationLevelDetail: employee.educationLevel,
                technicalSkillsDetail: employee.technicalSkills,
                languageProficiencyDetail: employee.languageProficiency,
                locationFitDetail: employee.locationFit
            };
        }).sort((a, b) => a.topisisScore - b.topisisScore);
    };

    // Execute TOPSIS Analysis
    const normalizedData = normalizeData(filteredEmployees);
    return calculateTOPSISScore(normalizedData);
}

function RankEmployee() {
    const initialCriteria = [
        {
            name: 'Years of Experience',
            key: 'yearsOfExperience',
            weight: 0.2,
            selected: true,
            type: 'benefit',
            calculate: (employee, resume) => calculateYearsOfExperience(resume)
        },
        {
            name: 'Education Level',
            key: 'educationLevel',
            weight: 0.2,
            selected: true,
            type: 'benefit',
            calculate: (employee, resume) => calculateEducationScore(resume)
        },
        {
            name: 'Technical Skills',
            key: 'technicalSkills',
            weight: 0.2,
            selected: true,
            type: 'benefit',
            calculate: (employee, resume) => calculateTechnicalSkillsScore(resume)
        },
        {
            name: 'Soft Skills',
            key: 'softSkills',
            weight: 0.2,
            selected: true,
            type: 'benefit',
            calculate: (employee, resume) => calculateSoftSkillsScore(resume)
        },
        {
            name: 'Language Proficiency',
            key: 'languageProficiency',
            weight: 0.2,
            selected: true,
            type: 'benefit',
            calculate: (employee, resume) => calculateLanguageScore(resume)
        },
        // You can add more criteria here if needed
    ];

    const user = useSelector((state) => state.auth.user);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [noticePeriod, setNoticePeriod] = useState(null);
    const [updateEmployee] = useUpdateEmployeeMutation();
    const employees = useSelector((state) => state.company.employees); // Fetch employees from Redux store
    const [selectedRole, setSelectedRole] = useState('All Roles');
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const { data: departmentsData } = useGetDepartmentsQuery(user.company);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const { data: allResumes, isLoading: isResumesLoading } = useGetAllResumesQuery(user.company);
    const [criteria, setCriteria] = useState(initialCriteria);
    // Extract unique roles from employee data
    const availableRoles = [...new Set(employees.map((employee) => employee.jobTitle))];
    const [convertApplicantToEmployee] = useConvertApplicantToEmployeeMutation();

    // Handle role selection change
    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            jobTitle: '',
            hireDate: dayjs().utc().format(),
            terminationDate: null,
            gender: '',
            department: '',
            salary: 0,
        },
        validationSchema: Yup.object().shape({
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            email: Yup.string().email('Must be a valid email').required('Email is required'),
            jobTitle: Yup.string().required('Job title is required'),
            department: Yup.string().required('Department is required'),
            hireDate: Yup.date().required('Hire date is required'),
            gender: Yup.string().required('Gender is required'),
            salary: Yup.number().required('Salary is required'),
        }),
        onSubmit: (values) => {
            setOpen(false);
            formik.resetForm();
        },
    });

    // Handle Run TOPSIS Analysis button click
    const handleRunTOPSIS = async () => {

        const roleSpecificEmployees = employees.filter((employee) => {
            const employeeRoleLevel = determineRole(employee.jobTitle); // Get hierarchy level for the employee's role

            return selectedRole != "All Roles"
                ? employee.jobTitle === selectedRole && // Matches the role criteria
                employeeRoleLevel <= 1 && // Meets the role level criteria
                employee._id !== user._id && // Exclude current user
                employee.terminationDate == null // Exclude terminated employees
                : employeeRoleLevel <= 1 && // Meets the role level criteria
                employee._id !== user._id && // Exclude current user
                employee.terminationDate == null;

        });



        const validResumes = roleSpecificEmployees.map((employee) => {
            const resume = allResumes.find((resume) => resume.user === employee._id);
            return resume ? { id: employee._id, resume } : null;
        }).filter(Boolean);

        console.log(validResumes);

        // Run TOPSIS analysis
        const rankedEmployeeList = performTOPSISAnalysis(
            roleSpecificEmployees,
            departmentsData,
            selectedRole,
            selectedDepartment,
            allResumes,
            criteria
        );

        console.log(rankedEmployeeList);

        // Update the filtered employees state
        setFilteredEmployees(rankedEmployeeList.slice(0, 10));
    };

    const handleTerminateClick = (id) => {
        const employee = employees.find((emp) => emp._id === id);
        setSelectedEmployee(employee);
        setConfirmationOpen(true);
    };

    const dispatch = useDispatch();

    const { data, isSuccess } = useGetEmployeesQuery(user.company);

    useEffect(() => {
        if (isSuccess) {
            dispatch(setEmployees(data.employees));
        }
    }, [data, dispatch, isSuccess]);

    const confirmTerminateEmployee = async () => {
        setConfirmationOpen(false);
        try {
            // Determine termination date based on selected notice period
            let company = user.company;
            let _id = selectedEmployee._id;
            const updatedEmployee = {
                ...selectedEmployee,
                terminationDate: dayjs(noticePeriod).toISOString() // Convert to ISO string
            };


            if (dayjs(noticePeriod).isSame(dayjs(), 'day')) {
                // If noticePeriod is today's date
                console.log("terminate immediately");
                const convertedEmployee = { company, _id };
                await convertApplicantToEmployee(convertedEmployee);
            } else if (dayjs(noticePeriod).isAfter(dayjs(), 'day')) {
                // If noticePeriod is a future date
                await updateEmployee(updatedEmployee);
            } else {
                console.error('Notice period cannot be a past date.');
            }

            // Update local state after successful termination
            dispatch(setEmployees(
                employees.map(emp => emp._id === selectedEmployee._id ? updatedEmployee : emp)
            ));

            // Decrease the required termination count
            setRequiredTerminations((prevCount) => Math.max(prevCount - 1, 0));

            setSelectedEmployee(null); // Reset selected employee
        } catch (error) {
            console.error('Failed to terminate employee:', error);
        }
    };

    const totalWeight = criteria.reduce(
        (sum, item) => (item.selected ? sum + item.weight : sum),
        0
    );

    const handleCheckboxChange = (index) => {
        setCriteria((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const handleWeightChange = (index, newWeight) => {
        setCriteria((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, weight: parseFloat(newWeight) || 0 } : item
            )
        );
    };

    const handleCancel = () => {
        setNoticePeriod(null);
        setConfirmationOpen(false);
    };

    return (
        <Stack spacing={4} p={0}>

            <Card sx={{ p: 4, mx: 'auto' }}>
                <Stack spacing={3}>
                    <FormControl fullWidth>
                        <InputLabel id="role-select-label">Select Role</InputLabel>
                        <Select
                            labelId="role-select-label"
                            value={selectedRole}
                            onChange={handleRoleChange}
                            label="Select Role"
                        >
                            <MenuItem value="All Roles">All Roles</MenuItem>
                            {availableRoles.map((role) => (
                                <MenuItem key={role} value={role}>
                                    {role}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Typography variant="h5" mb={2}>
                        Select and Assign Weightage to Criteria
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Select</TableCell>
                                <TableCell>Criteria</TableCell>
                                <TableCell align="right">Weightage</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {criteria.map((criterion, index) => (
                                <TableRow key={criterion.name}>
                                    <TableCell>
                                        <Checkbox
                                            checked={criterion.selected}
                                            onChange={() => handleCheckboxChange(index)}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{criterion.name}</TableCell>

                                    <TableCell align="right">
                                        <FormControl
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                width: "100px", // Adjust width as needed
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: "8px", // Rounded corners
                                                },
                                                "& .MuiOutlinedInput-input": {
                                                    padding: "10px", // Adjust padding for better alignment
                                                    textAlign: "center", // Center-align the text
                                                },
                                            }}
                                        >
                                            <InputLabel htmlFor={`criterion-weight-${index}`} sx={{ fontSize: "14px" }}>
                                                Weight
                                            </InputLabel>
                                            <OutlinedInput
                                                id={`criterion-weight-${index}`}
                                                type="number"
                                                value={criterion.weight}
                                                onChange={(e) => handleWeightChange(index, e.target.value)}
                                                disabled={!criterion.selected}
                                                inputProps={{ min: 0, max: 1, step: 0.05 }}
                                                label="Weightage"
                                            />
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Typography
                        variant="body2"
                        mt={2}
                        color={totalWeight != 1 ? 'error' : 'textSecondary'}
                        sx={{ fontSize: '16px' }}
                    >
                        {totalWeight > 1
                            ? `Total weightage exceeds 1. Current total: ${totalWeight.toFixed(2)}`
                            : totalWeight < 1
                                ? `Total weightage below 1. Current total: ${totalWeight.toFixed(2)}`
                                : `Total weightage: ${totalWeight.toFixed(2)}`}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRunTOPSIS}
                        disabled={totalWeight != 1}
                        sx={{
                            backgroundColor: '#4a93ec',
                            '&:hover': {
                                backgroundColor: '#3b7bc8',
                            },
                        }}
                    >
                        Run TOPSIS Analysis
                    </Button>
                </Stack>
            </Card>

            {/* Display results if there are filtered employees */}
            {filteredEmployees.length > 0 && (
                <Card sx={{ p: 4, mt: 4 }}>
                    <Typography variant="h5" mb={2}>
                        Results for Role: {selectedRole}
                    </Typography>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Joined</TableCell>
                                <TableCell>Terminate</TableCell>
                                <TableCell>TOPSIS Score</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEmployees.map((employee) => {
                                const isTerminated = employee.terminationDate && dayjs(employee.terminationDate).isSameOrBefore(dayjs());
                                const isPendingTermination = employee.terminationDate && dayjs(employee.terminationDate).isAfter(dayjs());
                                return (
                                    <TableRow key={employee._id}>
                                        <TableCell>{employee.firstName + ' ' + employee.lastName}</TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>
                                            {departmentsData &&
                                                departmentsData.departments
                                                    .filter((department) => department._id === employee.department)
                                                    .map((department) => department.name)}
                                        </TableCell>
                                        <TableCell>
                                            {employee.hireDate && dayjs(employee.hireDate).format('DD MMM YYYY')}
                                        </TableCell>
                                        <TableCell>
                                            {isTerminated
                                                ? 'Terminated'
                                                : isPendingTermination
                                                    ? dayjs(employee.terminationDate).format('DD MMM YYYY')
                                                    : 'Active'}
                                        </TableCell>
                                        <TableCell>
                                            {(employee.topisisScore * 100).toFixed(2)}%
                                        </TableCell>

                                        <TableCell align="right">

                                            <IconButton
                                                onClick={() => handleTerminateClick(employee._id)}
                                                color="error"
                                                sx={{
                                                    border: '2px solid',
                                                    borderColor: 'error.main',
                                                    color: 'error',
                                                    backgroundColor: 'transparent',
                                                    borderRadius: '8px',
                                                    padding: '6px',
                                                    fontSize: '1rem',
                                                    fontWeight: 'bold',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 0, 0, 1)',
                                                        color: '#1C2536',
                                                    },
                                                }}
                                            >
                                                Terminate
                                            </IconButton>

                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Card>
            )}

            {/* Confirmation Dialog */}
            <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
                <DialogTitle>Confirm Termination</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>
                        Are you sure you want to terminate {selectedEmployee?.firstName} {selectedEmployee?.lastName}?
                    </Typography>

                    {/* File Upload Input */}
                    <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
                        <Typography variant="body2">Select Termination Date:</Typography>

                        <Stack direction="row" spacing={2} justifyContent="left">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    fullWidth
                                    label="Termination Date *"
                                    name="terminationDate"
                                    value={formik.values.terminationDate ? dayjs(formik.values.terminationDate) : null}
                                    onChange={(newValue) => setNoticePeriod(newValue)}
                                    required
                                />
                            </LocalizationProvider>
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmTerminateEmployee}
                        color="error"
                        disabled={!noticePeriod || noticePeriod.isBefore(dayjs().subtract(1, "day"))}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}

export default RankEmployee;
