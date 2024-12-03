import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    TablePagination,
    Paper,
    Button,
    TextField,
    Typography,
    Stack,
    Box,
} from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox'; // Icon for empty state
import { inboxDocuments as documents } from './inboxData';
import { useGetDepartmentsQuery } from '@features/company/companyApiSlice';

const Inbox = () => {
    const user = useSelector((state) => state.auth.user);
    const [filteredDocs, setFilteredDocs] = useState(documents);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { data: departmentsData } = useGetDepartmentsQuery(user.company);
    const [departmentOptions, setDepartmentOptions] = useState([]);

    // Fetch department data
    useEffect(() => {
        if (departmentsData) {
            setDepartmentOptions(departmentsData.departments || []);
        }
    }, [departmentsData]);

    const getDepartmentName = () => {
        if (!departmentOptions.length) return 'Loading...';
        const department = departmentOptions.find((dept) => dept._id === user.department);
        return department ? department.name : 'Unknown Department';
    };

    // Search functionality
    useEffect(() => {
        setFilteredDocs(
            documents.filter(
                (doc) =>
                    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    doc.sender.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, documents]);

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Stack spacing={4}>
            <Typography variant="h4">Document Inbox</Typography>

            <Paper>
                <Stack spacing={2} sx={{ p: 4 }}>
                    <Typography variant="h5">User Details</Typography>
                    <Typography variant="body1">
                        <b>Name: </b> {user.firstName + ' ' + user.lastName}
                    </Typography>
                    <Typography variant="body1">
                        <b>Email: </b> {user.email}
                    </Typography>
                    <Typography variant="body1">
                        <b>Department: </b> {getDepartmentName()}
                    </Typography>
                </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
                {/* Search Bar */}
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                    <TextField
                        label="Search Documents"
                        variant="filled"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Stack>

                {/* Document Table */}
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell>Document Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Size</TableCell>
                                <TableCell>Sender</TableCell>
                                <TableCell>Transfer Date</TableCell>
                                <TableCell sx={{ color: '#e0e0e0', textAlign: 'center' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDocs
                                .filter((doc) => doc.department === getDepartmentName())
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length > 0 ? (
                                filteredDocs
                                    .filter((doc) => doc.department === getDepartmentName())
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((doc, index) => (
                                        <TableRow key={doc.id}>
                                            <TableCell>{index + 1 + page * rowsPerPage}.</TableCell>
                                            <TableCell>{doc.name}</TableCell>
                                            <TableCell>{doc.type}</TableCell>
                                            <TableCell>{doc.size}</TableCell>
                                            <TableCell>{doc.sender}</TableCell>
                                            <TableCell>{doc.transferDate}</TableCell>
                                            <TableCell sx={{ color: '#e0e0e0', textAlign: 'center' }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => alert(`Downloading: ${doc.name}`)}
                                                >
                                                    Download
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                py: 4,
                                            }}
                                        >
                                            <InboxIcon sx={{ fontSize: 80, color: 'gray' }} />
                                            <Typography variant="h6" color="gray">
                                                Inbox is Currently Empty
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredDocs.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Stack>
    );
};

export default Inbox;
