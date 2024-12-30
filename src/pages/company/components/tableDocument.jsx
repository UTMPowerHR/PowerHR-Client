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
import NotesIcon from '@mui/icons-material/Notes';
import { Delete, Edit, Save } from '@mui/icons-material';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import { useGetDepartmentsQuery } from '@features/company/companyApiSlice';
import _ from 'lodash';
import { useUploadDocumentMutation, useGetAllDocumentQuery, useDeleteDocumentMutation, useUpdateDocumentMutation, } from '@features/document/documentApiSlice';

dayjs.extend(utc);

function TableDocument({ selectedEmployee }) {
    const user = useSelector((state) => state.auth.user);
    const { data: documentData } = useGetAllDocumentQuery();
    const [documents, setDocuments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDocs, setFilteredDocs] = useState(documents);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editedName, setEditedName] = useState('');
    const { data: departmentsData } = useGetDepartmentsQuery(user.company);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [handoverNotes, setHandoverNotes] = useState('');
    const [handoverModalOpen, setHandoverModalOpen] = useState(false);
    const [displayHandoverModalOpen, setDisplayHandoverModalOpen] = useState(false);
    const [uploadDocument] = useUploadDocumentMutation();
    const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();
    const [editDocument, { isLoading: isEditing }] = useUpdateDocumentMutation();

    useEffect(() => {
        if (departmentsData) {
            setDepartmentOptions(departmentsData.departments);
        }
    }, [departmentsData]);

    useEffect(() => {
        if (documentData) {
            setDocuments(documentData);
        }
    }, [documentData]);

    useEffect(() => {
        const results = documents.filter((doc) =>
            doc.uploader == selectedEmployee.name
        );
        setDocuments(results);
    }, [documents]);

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
            case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
                return 'Word Document';
            case 'plain':
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

    const getDepartmentName = () => {
        const department = departmentOptions.find((dept) => dept._id === selectedEmployee.department);
        return department ? department.name : 'Unknown Department';
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

    //Handle Delete Document
    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete the file from the list?")) {
            try {
                await deleteDocument(id).unwrap();
    
                alert('Document deleted successfully');
              } catch (error) {    
                console.error('Error:', error);
              }
        }
    };

    //Handle Edit Document name
    const handleEdit = (id, currentName) => {
        setEditingId(id);
        setEditedName(currentName);
    };

    const handleCloseEdit = () => {
        setEditingId(null);
        setEditedName('');
    };

    const getFileNameById = (id) => {
        const file = documents.find(file => file._id === id);
        return file ? file.name : null;
    };

    const getBaseName = (name) => {
        const extensionStartIndex = (name.indexOf('.') > 0) ? name.indexOf('.') : name.length;
        const baseName = name.substring(0, extensionStartIndex);
        return baseName;
    };

    const isNameContainSpecialChar = (name) => {
        var format = /[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/; //regEx for special characters
        return format.test(name);
    };

    const isNameExists = (name) => {
        return documents.some(file => (getBaseName(file.name) === name));
    };

    //Sanitize the filename and extension to prevent multiple extension added to the filename
    const handleSave = (id) => {

        if (!editedName) {
            alert("Invalid Filename. Please enter a filename.");
            handleCloseEdit();
            return;
        }
        else if (isNameContainSpecialChar(getBaseName(editedName))) {
            alert("Invalid Filename. Please enter a valid filename without any special characters.");
            handleCloseEdit();
            return;
        }
        else if (getBaseName(editedName).length > 50) {
            alert("Invalid Filename. Filename must not exceed 50 characters.");
            handleCloseEdit();
            return;
        }
        else if (isNameExists(editedName) && (editedName != getFileNameById(id))) {
            alert("Duplicate Filename. The Filename already existed.");
            handleCloseEdit();
            return;
        }

        setDocuments((prevDocs) =>
            prevDocs.map((doc) => {
                if (doc._id === id) {
                    // Extract the original extension from the document name
                    const originalExtension = doc.name.substring(doc.name.lastIndexOf('.'));

                    const baseName = getBaseName(editedName);

                    // Combine the base name with the original extension
                    const sanitizedName = baseName + originalExtension;
                    const newDoc = { ...doc, name: sanitizedName };
                    editDocument(newDoc);
                    return newDoc;
                }
                return doc;
            })
        );
        
        handleCloseEdit();
    };

    //Table Pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    //Handover notes
    const confirmUploadWithNotes = async (e) => {
        e.preventDefault();
        //uploadNewDoc is used as format to send the doc to the backend server
        const uploadNewDoc = {
            file: selectedFile,
            uploader: selectedEmployee.name,
            department: getDepartmentName(),
            notes: handoverNotes || 'No notes provided',
        };
        //newDoc is used to add the uploaded doc to the list of the docs (absence of it will result in error in the filter function)
        const newDoc = {
            id: documents.length + 1,
            name: selectedFile.name,
            type: getFileType(selectedFile.name),
            size: formatFileSize(selectedFile.size),
            uploader: selectedEmployee.name,
            date: new Date().toISOString().split('T')[0],
            department: getDepartmentName(),
            notes: handoverNotes || 'No notes provided',
        };

        uploadDocument(uploadNewDoc)
            .unwrap()
            .then(() => {
                setDocuments((prevDocs) => [...prevDocs, newDoc]);
                alert(`File "${selectedFile.name}" uploaded successfully with notes.`);
            })
            .catch((err) => {
                console.error('Upload failed: ', err);
            });

        setSelectedFile(null);
        setHandoverNotes('');
        setHandoverModalOpen(false);
    };

    //Display Handover Notes
    const handleDisplayHandoverNotes = (doc) => {
        setDisplayHandoverModalOpen(true);
        const selectedDoc = documents.find((docs) => (docs._id === doc));
        setHandoverNotes(selectedDoc.notes);
    };


    return (
        <Stack spacing={4}>
            <Typography variant="h4">Transfer Digital Document</Typography>

            <Paper>
                <Stack spacing={2} sx={{ p: 4 }}>
                    <Typography variant="h5">Employee Details</Typography>
                    <Typography variant="body1">
                        <b>Name: </b> {selectedEmployee ? selectedEmployee?.name : ""}
                    </Typography>
                    <Typography variant="body1">
                        <b>Email: </b> {selectedEmployee ? selectedEmployee?.email : ""}
                    </Typography>
                    <Typography variant="body1">
                        <b>Department: </b> {getDepartmentName()}
                    </Typography>
                    <Typography variant="body1">
                        <b>Termination Date: </b> {selectedEmployee ? dayjs(selectedEmployee?.terminationDate).format("DD MMMM YYYY") : ""}
                    </Typography>
                </Stack>
            </Paper>

            <Paper
                elevation={3}
                sx={{
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

                <TableContainer>
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
                                <TableRow key={doc._id}>
                                    <TableCell sx={{ color: '#e0e0e0', textAlign: 'center' }}>{index + 1 + page * rowsPerPage}.</TableCell>
                                    <TableCell>
                                        {editingId === doc._id ? (
                                            <TextField
                                                value={getBaseName(editedName)}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                size="small"
                                                variant="outlined"
                                                sx={{ input: { color: '#e0e0e0' } }}
                                            />
                                        ) : (
                                            doc.name
                                        )}
                                    </TableCell>
                                    <TableCell>{getFileType(doc.name)}</TableCell>
                                    <TableCell>{doc.size}</TableCell>
                                    <TableCell sx={{ color: '#e0e0e0', textAlign: 'center' }}>{doc.date}</TableCell>
                                    <TableCell sx={{ color: '#e0e0e0', textAlign: 'center' }}>
                                        <IconButton onClick={() => handleDisplayHandoverNotes(doc._id)}>
                                            <NotesIcon sx={{ color: '#e0e0e0' }} />
                                        </IconButton>
                                        {editingId === doc._id ? (
                                            <IconButton onClick={() => handleSave(doc._id)}>
                                                <Save sx={{ color: '#e0e0e0' }} />
                                            </IconButton>
                                        ) : (
                                            <IconButton onClick={() => handleEdit(doc._id, doc.name)}>
                                                <Edit sx={{ color: '#e0e0e0' }} />
                                            </IconButton>
                                        )}
                                        <IconButton onClick={() => handleDelete(doc._id)}>
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
}

export default TableDocument;
