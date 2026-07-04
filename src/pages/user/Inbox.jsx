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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import NotesIcon from '@mui/icons-material/Notes';
import { inboxData as inboxDocuments } from './inboxData';
import { useGetDepartmentsQuery } from '@features/company/companyApiSlice';
import { useGetAllDocumentQuery, useDownloadDocumentMutation } from '@features/document/documentApiSlice';

const Inbox = () => {
    const user = useSelector((state) => state.auth.user);
    const { data: documentData } = useGetAllDocumentQuery();
    const [documents, setDocuments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDocs, setFilteredDocs] = useState(documents);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { data: departmentsData } = useGetDepartmentsQuery(user.company);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [handoverNotes, setHandoverNotes] = useState('');
    const [displayHandoverModalOpen, setDisplayHandoverModalOpen] = useState(false);
    const [triggerDownload, { isLoading }] = useDownloadDocumentMutation();


    // Fetch department data
    useEffect(() => {
        if (departmentsData) {
            setDepartmentOptions(departmentsData.departments || []);
        }
    }, [departmentsData]);

    useEffect(() => {
        if (documentData) {
            setDocuments(documentData);
        }
    }, [documentData]);

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
                    doc.uploader.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, documents]);

    // Filter document by department
    useEffect(() => {
        const results = documents.filter((doc) => doc.department === getDepartmentName());
        setFilteredDocs(results);
    }, [documents, departmentOptions, user.department]);

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    //Display Handover Notes
    const handleDisplayHandoverNotes = (docId) => {
        console.log(documents);
        setDisplayHandoverModalOpen(true);
        const selectedDoc = filteredDocs.find((doc) => (doc._id === docId));
        setHandoverNotes(selectedDoc.notes);
    };

    const getFileType = (fileName) => {
        const extension = fileName.toLowerCase();
        switch (extension) {
            case 'pdf':
                return 'PDF';
            case 'doc':
            case 'docx':
                return 'Word Document';
            case 'txt':
                return 'Text File';
            case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
                return 'Word Document';
            case 'plain':
                return 'Text File';
            default:
                return 'Unknown';
        }
    };

    const handleDownload = async (documentId, documentName) => {
        try {
            const blob = await triggerDownload(documentId).unwrap();
    
            // Handle the successful download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = documentName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the document:', error);
    
            if (error.status) {
                console.error('HTTP Status:', error.status);
            }
            if (error.data) {
                console.error('Error Details:', await error.data.text());
            }
        }
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
                                <TableCell>Uploader</TableCell>
                                <TableCell>Upload Date</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Notes</TableCell>
                                <TableCell sx={{ color: '#e0e0e0', textAlign: 'center' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDocs
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length > 0 ? (
                                filteredDocs
                                    .filter((doc) => doc.department === getDepartmentName())
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((doc, index) => (
                                        <TableRow key={doc._id}>
                                            <TableCell>{index + 1 + page * rowsPerPage}.</TableCell>
                                            <TableCell>{doc.name}</TableCell>
                                            <TableCell>{getFileType(doc.type)}</TableCell>
                                            <TableCell>{doc.size}</TableCell>
                                            <TableCell>{doc.uploader}</TableCell>
                                            <TableCell>{doc.date}</TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                <IconButton onClick={() => handleDisplayHandoverNotes(doc._id)}>
                                                    <NotesIcon sx={{ color: '#e0e0e0' }} />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell sx={{ color: '#e0e0e0', textAlign: 'center' }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleDownload(doc._id, doc.name)}
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

            {/* Display Handover Notes Dialog */}
            <Dialog open={displayHandoverModalOpen} onClose={() => {
                setDisplayHandoverModalOpen(false);
                setHandoverNotes('');
            }}>
                <DialogTitle>Display Handover Notes</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Note Description"
                        type="text"
                        fullWidth
                        value={handoverNotes}
                        multiline
                        rows={4}
                        variant="filled"
                        disabled
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setDisplayHandoverModalOpen(false);
                        setHandoverNotes('');
                    }} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};

export default Inbox;
