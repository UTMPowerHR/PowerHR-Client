import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useGetDepartmentsQuery } from '@features/company/companyApiSlice';
import dayjs from 'dayjs';

function performTOPSISAnalysis(employees, departmentsData, selectedRole, selectedDepartment) {
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

    // TOPSIS Criteria Definition
    const criteria = [
        { name: 'workExperience', weight: 0.3, type: 'benefit' },
        { name: 'performanceRating', weight: 0.3, type: 'benefit' },
        { name: 'skillLevel', weight: 0.2, type: 'benefit' },
        { name: 'trainingCost', weight: 0.2, type: 'cost' }
    ];

    // Step 2: Normalize Data
    const normalizeData = (data) => {
        const normalized = data.map(employee => ({
            ...employee,
            workExperience: dayjs(employee.terminationDate).diff(dayjs(employee.hireDate), 'month'),
            performanceRating: employee.performanceRating || 3,
            skillLevel: employee.skillLevel || 3,
            trainingCost: employee.trainingCost || 5000
        }));

        const criteriaValues = {};
        criteria.forEach(criterion => {
            const values = normalized.map(e => e[criterion.name]);
            criteriaValues[criterion.name] = { 
                min: Math.min(...values), 
                max: Math.max(...values) 
            };
        });

        return normalized.map(employee => {
            const normalizedValues = {};
            
            criteria.forEach(criterion => {
                const { min, max } = criteriaValues[criterion.name];
                const value = employee[criterion.name];
                
                // Normalize benefit and cost criteria differently
                let normalizedValue = criterion.type === 'benefit'
                    ? (value - min) / (max - min)
                    : (max - value) / (max - min);
                
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
                topisisScore: isNaN(topisisScore) ? 0 : topisisScore 
            };
        }).sort((a, b) => b.topisisScore - a.topisisScore);
    };

    // Execute TOPSIS Analysis
    const normalizedData = normalizeData(filteredEmployees);
    return calculateTOPSISScore(normalizedData);
}

function RankedEmployeesTable() {
    const user = useSelector((state) => state.auth.user);
    const employees = useSelector((state) => state.company.employees);
    const { data: departmentsData } = useGetDepartmentsQuery(user.company);
    
    const [rankedEmployees, setRankedEmployees] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    // Derive available roles and departments
    const availableRoles = [...new Set(employees.map(emp => emp.jobTitle))];
    const availableDepartments = departmentsData 
        ? [...new Set(departmentsData.departments.map(dept => dept.name))] 
        : [];

    // Handle filter application
    const handleApplyFilter = () => {
        const rankedEmployeeList = performTOPSISAnalysis(
            employees, 
            departmentsData, 
            selectedRole, 
            selectedDepartment
        );
        setRankedEmployees(rankedEmployeeList.slice(0, 10));
    };

    // Auto-apply filters on data change
    useEffect(() => {
        handleApplyFilter();
    }, [employees, departmentsData]);

    return (
        <Card>
            <Stack direction="column" spacing={2} p={2}>
                <Typography variant="h6">Top Candidates for Rehiring (TOPSIS Analysis)</Typography>
                
                <Stack direction="row" spacing={2} alignItems="center">
                    {/* Role Filter */}
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
                    </FormControl>

                    {/* Department Filter */}
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
                    </FormControl>

                    {/* Apply Filter Button */}
                    <Button 
                        variant="contained" 
                        onClick={handleApplyFilter}
                    >
                        Apply Filter
                    </Button>
                </Stack>

                {/* Ranking Table */}
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Work Experience (Months)</TableCell>
                            <TableCell align="right">TOPSIS Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rankedEmployees.map((employee, index) => (
                            <TableRow key={employee._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                                <TableCell>
                                    {departmentsData?.departments
                                        .find(dept => dept._id === employee.department)?.name || employee.department}
                                </TableCell>
                                <TableCell>
                                    {dayjs(employee.terminationDate).diff(dayjs(employee.hireDate), 'month')}
                                </TableCell>
                                <TableCell align="right">
                                    {(employee.topisisScore * 100).toFixed(2)}%
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Stack>
        </Card>
    );
}

export default RankedEmployeesTable;