import React, { useState, useEffect, useMemo } from 'react';
import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Checkbox,
    Input,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useGetDepartmentsQuery } from '@features/company/companyApiSlice';
import dayjs from 'dayjs';
import {
    useCreateResumeMutation,
    useGetResumeByUserQuery,
    useGetAllResumesQuery,
    useUpdateResumeMutation,
    useDeleteResumeMutation,
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

function performTOPSISAnalysis(employees, departmentsData, selectedRole, selectedDepartment, allResumes, dynamicCriteria) {

    // Filter out unselected criteria
    const selectedCriteria = dynamicCriteria.filter(criterion => criterion.selected);

    // Validate total weight
    const totalWeight = selectedCriteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    if (Math.abs(totalWeight - 1) > 0.01) {
        throw new Error('Total weight must sum to 1');
    }

    // Step 1: Filter Employees
    let filteredEmployees = employees.filter(emp =>
        emp.terminationDate && dayjs(emp.terminationDate).isBefore(dayjs(), 'day')
    );

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
        }).sort((a, b) => b.topisisScore - a.topisisScore);
    };

    // Execute TOPSIS Analysis
    const normalizedData = normalizeData(filteredEmployees);
    return calculateTOPSISScore(normalizedData);
}

// Update the component to pass allResumes
function RankedEmployeesTable() {

    const initialCriteria = [
        {
            name: 'Years of Experience',
            key: 'yearsOfExperience',
            weight: 0.1,
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
            weight: 0.4,
            selected: true,
            type: 'benefit',
            calculate: (employee, resume) => calculateSoftSkillsScore(resume)
        },
        {
            name: 'Language Proficiency',
            key: 'languageProficiency',
            weight: 0.1,
            selected: true,
            type: 'benefit',
            calculate: (employee, resume) => calculateLanguageScore(resume)
        },
        // You can add more criteria here if needed
    ];
    const user = useSelector((state) => state.auth.user);
    const employees = useSelector((state) => state.company.employees);
    const { data: departmentsData } = useGetDepartmentsQuery(user.company);
    const { data: allResumes, isLoading: isResumesLoading } = useGetAllResumesQuery(user.company);
    const availableRoles = [...new Set(employees.map((employee) => employee.jobTitle))];



    // State for dynamic criteria
    const [criteria, setCriteria] = useState(initialCriteria);
    const [rankedEmployees, setRankedEmployees] = useState([]);
    const [selectedRole, setSelectedRole] = useState('All Roles');
    const [selectedDepartment, setSelectedDepartment] = useState('');


    // Handlers for criteria modification
    const handleCheckboxChange = (index) => {
        setCriteria(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const handleWeightChange = (index, newWeight) => {
        setCriteria(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, weight: parseFloat(newWeight) || 0 } : item
            )
        );
    };

    // Handle filter application
    const handleApplyFilter = () => {
        try {
            const rankedEmployeeList = performTOPSISAnalysis(
                employees,
                departmentsData,
                selectedRole,
                selectedDepartment,
                allResumes,
                criteria
            );
            setRankedEmployees(rankedEmployeeList.slice(0, 10));
        } catch (error) {
            // Handle weight sum error
            alert(error.message);
        }
    };

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    // Auto-apply filters on data change
    useEffect(() => {
        if (!isResumesLoading) {
            handleApplyFilter();
        }
    }, [employees, departmentsData, allResumes, isResumesLoading]);

    // Match resumes with ranked employees
    const rankedEmployeesWithResumes = useMemo(() => {
        if (!rankedEmployees || !allResumes) return [];

        return rankedEmployees.map(employee => {
            const matchedResume = allResumes.find(resume => resume.user === employee._id);

            // Log matching details for debugging
            console.log('Employee ID:', employee._id);
            console.log('Matched Resume:', matchedResume);

            return {
                ...employee,
                resume: matchedResume || null
            };
        });
    }, [rankedEmployees, allResumes]);

    return (
        <Stack spacing={4} p ={0}>
            <Card sx={{ p:4, mx: 'auto'}}>
                <Stack spacing={3}>
                    <FormControl fullWidth>
                        <InputLabel id="role-select-label">Select Role</InputLabel>
                        <Select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            label="Role"
                        >
                            <MenuItem value="">All Roles</MenuItem>
                            {availableRoles.map((role) => (
                                <MenuItem key={role} value={role}>{role}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* <Typography variant="h6">Top Candidates for Rehiring (TOPSIS Analysis)</Typography> */}
                    {/* Criteria Selection and Weightage Table */}
                    <Typography variant="h5" mb={2}>
                        Select and Assign Weightage to Criteria
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Criteria</TableCell>
                                <TableCell align="center">Select</TableCell>
                                <TableCell align="center">Weightage</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {criteria.map((criterion, index) => (
                                <TableRow key={criterion.name}>
                                    <TableCell>{criterion.name}</TableCell>
                                    <TableCell align="center">
                                        <Checkbox
                                            checked={criterion.selected}
                                            onChange={() => handleCheckboxChange(index)}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Input
                                            type="number"
                                            value={criterion.weight}
                                            onChange={(e) => handleWeightChange(index, e.target.value)}
                                            disabled={!criterion.selected}
                                            inputProps={{ min: 0, max: 1, step: 0.05 }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                        {/* Role Filter
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            label="Role"
                        >
                            <MenuItem value="">All Roles</MenuItem>
                            {availableRoles.map((role) => (
                                <MenuItem key={role} value={role}>{role}</MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}

                        {/* Department Filter
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Department</InputLabel>
                        <Select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            label="Department"
                        >
                            <MenuItem value="">All Departments</MenuItem>
                            {availableDepartments.map((dept) => (
                                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}

                        {/* Apply Filter Button */}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleApplyFilter}
                            // disabled={!selectedRole}
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

            {isResumesLoading ? (
                <Typography>Loading resumes...</Typography>
            ) : (
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell>Name</TableCell>
                            {/* <TableCell>Department</TableCell> */}
                            {/* <TableCell>Work Experience (Months)</TableCell> */}
                            <TableCell align="right">TOPSIS Score</TableCell>
                            {/* <TableCell>Resume Details</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rankedEmployeesWithResumes.map((employee, index) => (
                            <TableRow key={employee._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                                {/* <TableCell>
                                    {departmentsData?.departments
                                        .find(dept => dept._id === employee.department)?.name || employee.department}
                                </TableCell>
                                <TableCell>
                                    {dayjs(employee.terminationDate).diff(dayjs(employee.hireDate), 'month')}
                                </TableCell> */}
                                <TableCell align="right">
                                    {(employee.topisisScore * 100).toFixed(2)}%
                                </TableCell>
                                {/* <TableCell>
                                    {employee.resume ? (
                                        <Stack spacing={1}>
                                            <Typography variant="body2" fontWeight="bold">
                                                {employee.resume.basicDetail?.name}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {employee.resume.basicDetail?.title}
                                            </Typography>
                                            <Typography variant="body2">
                                                Experiences: {employee.resume.experience?.value?.length || 0}
                                            </Typography>
                                            <Typography variant="body2">
                                                Email: {employee.resume.basicDetail?.email}
                                            </Typography>
                                            <Typography variant="body2">
                                                Location: {employee.resume.basicDetail?.location}
                                            </Typography>
                                            {employee.resume.education?.value?.map((edu, eduIndex) => (
                                                <Typography key={eduIndex} variant="body2" color="textSecondary">
                                                    {edu.institution} - {edu.degree}
                                                </Typography>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Typography variant="body2" color="error">
                                            No Resume Found
                                        </Typography>
                                    )}
                                </TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Stack>
    );
}

export default RankedEmployeesTable;