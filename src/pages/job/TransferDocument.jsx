import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Paper,
    Typography,
    Button,
    Box,
    Stack,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Delete, Edit, Save } from '@mui/icons-material';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import { useGetDepartmentsQuery } from '@features/company/companyApiSlice';
import { documentData } from './documentData';

dayjs.extend(utc);

function TableDocument() {
    const user = useSelector((state) => state.auth.user);
    const [documents, setDocuments] = useState(documentData);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDocs, setFilteredDocs] = useState(documents);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingId, setEditingId] = useState(null); // Track which document is being edited
    const [editedName, setEditedName] = useState(''); // Track the new name for editing
    const [transferOpen, setTransferOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const { data: departmentsData } = useGetDepartmentsQuery(user.company);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [handoverNotes, setHandoverNotes] = useState('');
    const [handoverModalOpen, setHandoverModalOpen] = useState(false);

    useEffect(() => {
        if (departmentsData) {
            setDepartmentOptions(departmentsData.departments);
        }
    }, [departmentsData]);

    useEffect(() => {
        const results = documents.filter(doc =>
            doc.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredDocs(results);
    }, [searchQuery, documents]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const getFileType = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return 'PDF';
            case 'doc':
            case 'docx':
                return 'Word Document';
            case 'txt':
                return 'Text File';
            default:
                return 'Unknown';
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';

        const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const k = 1000;
        const dm = 2;

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const size = Math.round(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) * 100) / 100;

        return `${size} ${units[i]}`;
    };

    const handleUpload = () => {
        if (!selectedFile) {
            alert('Please select a file first.');
            return;
        }

        const MAX_FILE_SIZE_MB = 5;
        const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
        if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
            alert(`File size exceeds ${MAX_FILE_SIZE_MB}MB. Please upload a smaller file.`);
            return;
        }

        const validFileExtensions = ['pdf', 'doc', 'docx', 'txt', 'xlsx'];
        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
        if (!validFileExtensions.includes(fileExtension)) {
            alert(`Invalid file type. Please upload one of the following: ${validFileExtensions.join(', ')}`);
            return;
        }

        setHandoverModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete the file from the list?")) {
            const updatedDocuments = documents.filter(doc => doc.id !== id);
            setDocuments(updatedDocuments);
        }
    };

    const handleEdit = (id, currentName) => {
        setEditingId(id);
        setEditedName(currentName);
    };

    const getBaseName = () => {
        const extensionStartIndex = (editedName.indexOf('.') > 0) ? editedName.indexOf('.') : editedName.length;
        const baseName = editedName.substring(0, extensionStartIndex);
        return baseName;
    }

    const isNameContainSpecialChar = (name) => {
        var format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/; //regEx for special characters
        return format.test(name);
    }

    //Sanitize the filename and extension to prevent multiple extension added to the filename
    const handleSave = (id) => {

        if (!editedName) {
            alert("Invalid Filename. Please enter a filename.");
            return;
        }
        else if (isNameContainSpecialChar(getBaseName())) {
            alert("Invalid Filename. Please enter a valid filename without any special characters.");
            return;
        }
        else if (editedName.length > 20) {
            alert("Invalid Filename. Filename must not exceed 20 characters.");
            return;
        }

        setDocuments((prevDocs) =>
            prevDocs.map((doc) => {
                if (doc.id === id) {
                    // Extract the original extension from the document name
                    const originalExtension = doc.name.substring(doc.name.lastIndexOf('.'));

                    const baseName = getBaseName();

                    // Combine the base name with the original extension
                    const sanitizedName = baseName + originalExtension;

                    return { ...doc, name: sanitizedName };
                }
                return doc;
            })
        );

        setEditingId(null);
        setEditedName('');
    };

    //Transfer File to another department
    const handleTransferClick = (doc) => {
        setSelectedFile(doc);
        setTransferOpen(true);
    };

    const confirmTransfer = () => {
        if (selectedFile && selectedDepartment) {
            //handleTransfer(selectedFile, selectedDepartment); // Trigger the transfer logic
            setTransferOpen(false);
            setSelectedFile(null);
            setSelectedDepartment('');
        }
    };
    //

    //Table Pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    //Handover notes
    const confirmUploadWithNotes = () => {
        const newDoc = {
            id: documents.length + 1,
            name: selectedFile.name,
            type: getFileType(selectedFile.name),
            date: new Date().toISOString().split('T')[0],
            size: formatFileSize(selectedFile.size),
            handoverNotes: handoverNotes || 'No notes provided',
        };

        setDocuments((prevDocs) => [...prevDocs, newDoc]);
        setSelectedFile(null);
        setHandoverNotes('');
        setHandoverModalOpen(false);
        alert(`File "${selectedFile.name}" uploaded successfully with notes.`);
    };


    return (
        <Stack spacing={4}>
            <Typography variant="h4">Transfer Digital Document</Typography>

            <Paper>
            <Stack spacing={2} sx={{ p: 4 }}>
                    <Typography variant="h5">Employee Details</Typography>
                    <Typography variant="body1">
                        <b>Name: </b> {user.firstName + " " + user.lastName}
                    </Typography>
                    <Typography variant="body1">
                        <b>Email: </b> {user.email}
                    </Typography>
                    <Typography variant="body1">
                        <b>Termination Date: </b> {user ? dayjs(user?.terminationDate).format("DD MMMM YYYY") : ""}
                    </Typography>
                </Stack>
            </Paper>

            <Paper
                elevation={3}
                sx={{
                    backgroundColor: '#1a1a2e',
                    padding: '30px',
                    borderRadius: '8px',
                    color: '#e0e0e0',
                    margin: 'auto',
                    textAlign: 'center',
                    maxWidth: '100%',
                    paddingLeft: '30px',
                    paddingRight: '30px',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#e0e0e0' }}>
                    Uploaded Documents
                </Typography>

                <TextField
                    label="Search Documents"
                    variant="filled"
                    fullWidth
                    sx={{ mb: 3, backgroundColor: '#162447', input: { color: '#e0e0e0' }, label: { color: '#e0e0e0' } }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="file-upload-input"
                    />
                    <label htmlFor="file-upload-input">
                        <Button
                            variant="contained"
                            component="span"
                            sx={{
                                backgroundColor: '#1f4068',
                                '&:hover': { backgroundColor: '#1b3b5f' },
                                color: '#fff',
                                textTransform: 'none',
                            }}
                        >
                            Choose File
                        </Button>
                    </label>
                    <Typography variant="body2" sx={{ color: '#e0e0e0', flex: 1, ml: 2 }}>
                        {selectedFile ? selectedFile.name : 'No file selected'}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleUpload}
                        sx={{
                            backgroundColor: '#1f4068',
                            '&:hover': { backgroundColor: '#1b3b5f' },
                            color: '#fff',
                            textTransform: 'none',
                            ml: 2,
                        }}
                    >
                        Upload Document
                    </Button>
                </Box>

                <TableContainer sx={{ backgroundColor: '#1a1a2e' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: '#e0e0e0', textAlign: 'center' }}>No.</TableCell>
                                <TableCell>Document Name</TableCell>
                                <TableCell>Document Type</TableCell>
                                <TableCell>Size</TableCell>
                                <TableCell sx={{ color: '#e0e0e0', textAlign: 'center' }}>Upload Date</TableCell>
                                <TableCell sx={{ color: '#e0e0e0', textAlign: 'center' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDocs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((doc, index) => (
                                <TableRow key={doc.id}>
                                    <TableCell sx={{ color: '#e0e0e0', textAlign: 'center' }}>{index + 1 + page * rowsPerPage}.</TableCell>
                                    <TableCell>
                                        {editingId === doc.id ? (
                                            <TextField
                                                value={getBaseName()}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                size="small"
                                                variant="outlined"
                                                sx={{ input: { color: '#e0e0e0' } }}
                                            />
                                        ) : (
                                            doc.name
                                        )}
                                    </TableCell>
                                    <TableCell>{doc.type}</TableCell>
                                    <TableCell>{doc.size}</TableCell>
                                    <TableCell sx={{ color: '#e0e0e0', textAlign: 'center' }}>{doc.date}</TableCell>
                                    <TableCell sx={{ color: '#e0e0e0', textAlign: 'center' }}>
                                        <IconButton onClick={() => handleTransferClick(doc.id)}>
                                            <SendIcon sx={{ color: '#e0e0e0' }} />
                                        </IconButton>
                                        {editingId === doc.id ? (
                                            <IconButton onClick={() => handleSave(doc.id)}>
                                                <Save sx={{ color: '#e0e0e0' }} />
                                            </IconButton>
                                        ) : (
                                            <IconButton onClick={() => handleEdit(doc.id, doc.name)}>
                                                <Edit sx={{ color: '#e0e0e0' }} />
                                            </IconButton>
                                        )}
                                        <IconButton onClick={() => handleDelete(doc.id)}>
                                            <Delete sx={{ color: '#FF0000' }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

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

            <Dialog open={transferOpen} onClose={() => setTransferOpen(false)}>
                <DialogTitle>Transfer Document</DialogTitle>
                <DialogContent>
                    <Typography>Select the department to transfer this document:</Typography>
                    <Select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 2 }}
                    >
                        {departmentOptions.map((dept) => (
                            <MenuItem key={dept.id} value={dept.name}>
                                {dept.name}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setTransferOpen(false);
                        setSelectedDepartment('');
                    }} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmTransfer}
                        color="success"
                        disabled={!selectedDepartment}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Handover Notes Dialog */}
            <Dialog open={handoverModalOpen} onClose={() => setHandoverModalOpen(false)}>
                <DialogTitle>Handover Notes</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Handover Notes/Description"
                        type="text"
                        fullWidth
                        value={handoverNotes}
                        onChange={(e) => setHandoverNotes(e.target.value)}
                        multiline
                        rows={4}
                        variant="filled"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setHandoverModalOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmUploadWithNotes} color="success">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}

export default TableDocument;
