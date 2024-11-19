import React, { useState, useMemo } from 'react';
import {
    Card,
    Checkbox,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    Button
} from '@mui/material';
import { Scrollbar } from '@components/scrollbar';
import dayjs from 'dayjs';
import determineRole from './roleHierarchy';

function TableRankedEmployees({ 
    employees = [], 
    departmentsData = { departments: [] }, 
    user = {} 
}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Calculate and rank employees by work experience using useMemo
    const rankedEmployees = useMemo(() => {
        return employees
            .filter(employee => 
                employee?.terminationDate && // Ensure terminationDate exists
                determineRole(employee.jobTitle) <= 1 && // Same role filter as original table
                employee._id !== user._id // Exclude current user
            )
            .map(employee => ({
                ...employee,
                workExperience: dayjs(employee.terminationDate).diff(employee.hireDate, 'month')
            }))
            .sort((a, b) => b.workExperience - a.workExperience);
    }, [employees, user]);

    const handlePageChange = (event, newPage) => setPage(newPage);
    const handleRowsPerPageChange = (event) => setRowsPerPage(parseInt(event.target.value, 10));

    // If no ranked employees, show a message
    if (rankedEmployees.length === 0) {
        return (
            <Card sx={{ p: 2 }}>
                <Typography variant="body1" color="text.secondary" align="center">
                    No employees available for ranking
                </Typography>
            </Card>
        );
    }

    return (
        <Card sx={{ flex: 2, minWidth: '60%', height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}>
                <Typography variant="h5">Ranked Former Employees</Typography>
                <Typography variant="h6">
                    Total Ranked Employees: {rankedEmployees.length}
                </Typography>
            </Stack>
            <Divider />
            <Scrollbar>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox"><Checkbox /></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Work Experience (Months)</TableCell>
                            <TableCell>Joined</TableCell>
                            <TableCell>Terminated</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rankedEmployees
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((employee, index) => {
                                const departmentName = departmentsData.departments
                                    .find(dept => dept._id === employee.department)?.name || 'N/A';

                                return (
                                    <TableRow key={employee._id}>
                                        <TableCell padding="checkbox"><Checkbox /></TableCell>
                                        <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>{employee.jobTitle}</TableCell>
                                        <TableCell>{departmentName}</TableCell>
                                        <TableCell>{employee.workExperience}</TableCell>
                                        <TableCell>{dayjs(employee.hireDate).format('DD MMM YYYY')}</TableCell>
                                        <TableCell>{dayjs(employee.terminationDate).format('DD MMM YYYY')}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </Scrollbar>
            <TablePagination
                component="div"
                count={rankedEmployees.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Card>
    );
}

export default TableRankedEmployees;