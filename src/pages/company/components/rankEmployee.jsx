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
    TextField,
    Checkbox,
    Input,
} from '@mui/material';
import {
    useGetEmployeesQuery,
    useUpdateEmployeeMutation,
    useGetDepartmentsQuery,
} from '@features/company/companyApiSlice';
import dayjs from 'dayjs';
import determineRole from './roleHierarchy';
import { setEmployees } from '@features/company/companySlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import {
    useGetResumeByUserQuery,
    useGetAllResumesQuery,
} from '@features/resume/resumeApiSlice';

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
    const [weight, setWeight] = useState();
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [fileError, setFileError] = useState('');
    const [noticePeriod, setNoticePeriod] = useState('Please Select');
    const [updateEmployee] = useUpdateEmployeeMutation();
    const [terminationLetter, setTerminationLetter] = useState(null);
    const employees = useSelector((state) => state.company.employees); // Fetch employees from Redux store
    const [selectedRole, setSelectedRole] = useState('All Roles');
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [rankedEmployees, setRankedEmployees] = useState([]);
    const { data: departmentsData } = useGetDepartmentsQuery(user.company);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const { data: allResumes, isLoading: isResumesLoading } = useGetAllResumesQuery(user.company);
    const [criteria, setCriteria] = useState(initialCriteria);
    // Extract unique roles from employee data
    const availableRoles = [...new Set(employees.map((employee) => employee.jobTitle))];


    // Handle role selection change
    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

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

        console.log(roleSpecificEmployees);


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


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) { // Limit file size to 5MB
            setFileError('File size must be less than 5MB');
            setTerminationLetter(null);
        } else {
            setFileError('');
            setTerminationLetter(file);
        }
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
            if (!terminationLetter) {
                console.error('Termination letter is required');
                return;
            }

            // Determine termination date based on selected notice period
            let terminationDate;
            switch (noticePeriod) {
                case '1_month':
                    terminationDate = dayjs().add(1, 'month').format();
                    break;
                case '3_months':
                    terminationDate = dayjs().add(3, 'month').format();
                    break;
                case '6_months':
                    terminationDate = dayjs().add(6, 'month').format();
                    break;
                default:
                    break;
            }

            const updatedEmployee = { ...selectedEmployee, terminationDate };

            // Create FormData to send the file
            const formData = new FormData();
            formData.append('terminationLetter', terminationLetter);
            formData.append('terminationDate', terminationDate);
            formData.append('employeeId', selectedEmployee._id);

            await updateEmployee(updatedEmployee); // Update employee in the database

            // Update local state after successful termination
            dispatch(setEmployees(
                employees.map(emp => emp._id === selectedEmployee._id ? updatedEmployee : emp)
            ));

            // Decrease the required termination count
            setRequiredTerminations((prevCount) => Math.max(prevCount - 1, 0));

            setSelectedEmployee(null); // Reset selected employee
            setTerminationLetter(null); // Clear file input
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

    const handleApplyCriteria = () => {
        const selectedCriteria = criteria.filter((criterion) => criterion.selected);
        const totalWeight = selectedCriteria.reduce((sum, criterion) => sum + criterion.weight, 0);

        if (totalWeight !== 1) {
            alert('The total weight must equal 1.');
            return;
        }

        onApplyCriteria(selectedCriteria);
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
                        <Typography variant="body2">Select Notice Period:</Typography>
                        <Select
                            value={noticePeriod}
                            onChange={(e) => setNoticePeriod(e.target.value)}
                            fullWidth
                            displayEmpty
                            variant="outlined"
                        >
                            <MenuItem value="Please Select">Please Select</MenuItem>
                            <MenuItem value="1_month">1 Month</MenuItem>
                            <MenuItem value="3_months">3 Months</MenuItem>
                            <MenuItem value="6_months">6 Months</MenuItem>
                        </Select>

                        <Typography variant="body2">Please upload the Termination Letter:</Typography>
                        <OutlinedInput
                            type="file"
                            onChange={handleFileChange}
                            fullWidth
                            inputProps={{ accept: '.pdf,.doc,.docx' }}
                            error={!!fileError}
                        />
                        {fileError && (
                            <Typography color="error" variant="body2">
                                {fileError}
                            </Typography>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmationOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmTerminateEmployee}
                        color="error"
                        disabled={!terminationLetter || noticePeriod == "Please Select" || !/\.(pdf|doc|docx)$/i.test(terminationLetter.name)}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}

export default RankEmployee;
