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
    Dialog,
    DialogContent,
    TextField,
} from '@mui/material';
import dayjs from 'dayjs';
import {
    useCreateResumeMutation,
    useGetResumeByUserQuery,
    useGetAllResumesQuery,
    useUpdateResumeMutation,
    useDeleteResumeMutation,
} from '@features/resume/resumeApiSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import determineRole from './roleHierarchy';
import {
    useGetEmployeesQuery,
    useUpdateEmployeeMutation,
    useGetDepartmentsQuery,
} from '@features/company/companyApiSlice';
import { useGetAllEmploymentHistoryQuery } from '../../../features/employmentHistory/employmentHistoryApiSlice';
import { setEmployees } from '@features/company/companySlice';
import { useDispatch, useSelector } from 'react-redux';
import { filter } from 'lodash';

dayjs.extend(isSameOrBefore);

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
        emp.terminationDate && dayjs(emp.terminationDate).isSameOrBefore(dayjs(), 'day')
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
    const { data: employmentHistoryData } = useGetAllEmploymentHistoryQuery();
    const [employees, setEmployees] = useState([]);
    const { data: departmentsData } = useGetDepartmentsQuery(user.company);
    const { data: allResumes, isLoading: isResumesLoading } = useGetAllResumesQuery(user.company);
    const availableRoles = [...new Set(employees.map((employee) => employee.jobTitle))];
    const [rehiring, setRehiring] = useState(false);
    const [open, setOpen] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [updateEmployee] = useUpdateEmployeeMutation();
    const dispatch = useDispatch();



    // State for dynamic criteria
    const [criteria, setCriteria] = useState(initialCriteria);
    const [rankedEmployees, setRankedEmployees] = useState([]);
    const [selectedRole, setSelectedRole] = useState('All Roles');
    const [selectedDepartment, setSelectedDepartment] = useState('');


    useEffect(() => {
        if (employmentHistoryData) {
            const newEmployee = employmentHistoryData.map((emp) => {
                return {
                    ...emp._id,
                    jobTitle: emp.jobTitle,
                    terminationDate: emp.terminationDate,
                    hireDate: emp.hireDate,
                    deptName: emp.department.name,
                    departmentId: emp.department._id,
                    salary: emp.salary,
                    personalEmail: emp.personalEmail,
                    company: emp.company,
                    employmentHistoryId: emp._id,
                }
            });
            setEmployees(newEmployee);
        }
    }, [employees, employmentHistoryData]);

    const filteredEmployees = employees.filter((employee) => {

        // Check if employee is terminated (terminationDate is in the past or today)
        const isTerminated = employee.terminationDate &&
            dayjs(employee.terminationDate).isSameOrBefore(dayjs(), 'day');

        // Check if employee is scheduled to be hired (hireDate is in the future)
        const isScheduledForHire = employee.hireDate &&
            dayjs(employee.hireDate).isAfter(dayjs(), 'day');



        return (
            employee._id !== user._id &&
            (isTerminated || isScheduledForHire) // Show only terminated or scheduled employees
        );
    });


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

    // Handler for rehiring an employee
    const handleRehire = async () => {
        if (selectedEmployee) {
            setOpen(false);
            setRehiring(true);

            try {
                await updateEmployee({
                    ...selectedEmployee,
                    jobTitle: formik.values.jobTitle,
                    salary: formik.values.salary,
                    department: formik.values.department,
                    hireDate: formik.values.hireDate,
                    terminationDate: null,
                }).unwrap();

                dispatch(setEmployees(data.employees));
                formik.resetForm();
            } catch (error) {
                console.error("Failed to rehire employee:", error);
            } finally {
                setRehiring(false);
                setSelectedEmployee(null);
            }
        }
    };

    // Formik for rehire form
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            jobTitle: '',
            department: '',
            hireDate: dayjs().format(),
            salary: 0,
        },
        validationSchema: Yup.object().shape({
            jobTitle: Yup.string().required('Job title is required'),
            department: Yup.string().required('Department is required'),
            hireDate: Yup.date().required('Hire date is required'),
            salary: Yup.number().required('Salary is required'),
        }),
        onSubmit: handleRehire,
    });



    // Handler to open rehire dialog
    const handleOpenDialog = (employee) => {
        setSelectedEmployee(employee);
        formik.setValues({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            personalEmail: employee.personalEmail,
            jobTitle: employee.jobTitle,
            department: employee.department,
            hireDate: employee.hireDate,
            salary: employee.salary,
            gender: employee.gender,
            terminationDate: employee.terminationDate,
        });
        setOpen(true);
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
        <Stack spacing={4} p={0}>
            <Card sx={{ p: 4, mx: 'auto' }}>
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
                            <TableCell>Department</TableCell>
                            <TableCell align="right">TOPSIS Score</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rankedEmployeesWithResumes.map((employee, index) => (
                            <TableRow key={employee._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                                <TableCell>
                                    {departmentsData?.departments
                                        .find(dept => dept._id === employee.departmentId)?.name || 'N/A'}
                                </TableCell>
                                <TableCell align="right">
                                    {(employee.topisisScore * 100).toFixed(2)}%
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenDialog(employee)}
                                        disabled={rehiring}
                                    >
                                        Rehire
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
                <DialogContent>
                    <Stack spacing={2}>
                        <Typography variant="h5">Edit Rehire Employee Profile</Typography>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.firstName}
                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                            helperText={formik.touched.firstName && formik.errors.firstName}
                            disabled
                        />
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.lastName}
                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                            helperText={formik.touched.lastName && formik.errors.lastName}
                            disabled
                        />
                        <FormControl variant="filled" fullWidth>
                            <InputLabel>Gender</InputLabel>
                            <Select
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                                name="gender"
                                disabled
                            >
                                <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formik.values.email}
                            disabled
                        />
                        <TextField
                            fullWidth
                            label="Personal Email"
                            name="personalEmail"
                            value={formik.values.personalEmail}
                            disabled
                        />
                        <TextField
                            fullWidth
                            label="Job Title"
                            name="jobTitle"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.jobTitle}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Salary"
                            name="salary"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.salary}
                            required
                        />
                        <FormControl fullWidth required>
                            <InputLabel>Department</InputLabel>
                            <Select
                                value={formik.values.department}
                                onChange={formik.handleChange}
                                name="department"
                            >
                                {departmentsData?.departments.map((department) => (
                                    <MenuItem key={department._id} value={department._id}>
                                        {department.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Stack direction="row" spacing={2} justifyContent="right">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    fullWidth
                                    label="Hire Date *"
                                    name="hireDate"
                                    value={formik.values.hireDate ? dayjs(formik.values.hireDate) : null}
                                    onChange={(newValue) => {
                                        formik.setFieldValue('hireDate', newValue ? newValue.toISOString() : null); // Store ISO string in formik
                                    }}
                                    required
                                />
                            </LocalizationProvider>
                        </Stack>
                    </Stack>

                    <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setOpen(false);
                                formik.resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleRehire}
                            disabled={rehiring}
                        >
                            {rehiring ? 'Rehiring' : 'Rehire'}
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Stack>


    );
}

export default RankedEmployeesTable;