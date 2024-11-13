import React, { useState } from 'react';
import {
    Card,
    Stack,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';

function FilterComponent({ onFilterChange, onSubmit, roles = [], departments = [] }) {
    const [firstFilter, setFirstFilter] = useState('all');
    const [secondFilter, setSecondFilter] = useState('all');

    const handleFirstFilterChange = (event) => {
        setFirstFilter(event.target.value);
        onFilterChange && onFilterChange('firstFilter', event.target.value);
    };

    const handleSecondFilterChange = (event) => {
        setSecondFilter(event.target.value);
        onFilterChange && onFilterChange('secondFilter', event.target.value);
    };

    return (
        <Stack spacing={2} alignItems="center" justifyContent="center">
            <Card sx={{ p: 3, width: '400px' }}>
                <Stack direction="column" spacing={2}>
                    <FormControl fullWidth>
                        <InputLabel>Filter By Role</InputLabel>
                        <Select
                            value={firstFilter}
                            label="Filter By Role"
                            onChange={handleFirstFilterChange}
                        >
                            <MenuItem value="all">All Employees</MenuItem>
                            {roles.length > 0 ? (
                                roles.map(role => (
                                    <MenuItem key={role} value={role}>{role}</MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No roles available</MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Filter By Department</InputLabel>
                        <Select
                            value={secondFilter}
                            label="Filter By Department"
                            onChange={handleSecondFilterChange}
                        >
                            <MenuItem value="all">All Departments</MenuItem>
                            {departments.length > 0 ? (
                                departments.map(department => (
                                    <MenuItem key={department} value={department}>{department}</MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No departments available</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Stack>

                <Stack direction="row" justifyContent="center" mt={2}>
                    <Button variant="contained" color="primary" onClick={onSubmit}>
                        Submit
                    </Button>
                </Stack>
            </Card>
        </Stack>
    );
}

export default FilterComponent;
