import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Paper,
    Typography,
    Button,
    Box,
    Stack,
    IconButton
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';

dayjs.extend(utc);

function TableDocument({ selectedEmployee }) {
    const [documents, setDocuments] = useState([
        { id: 1, name: 'Document1.pdf', type: 'PDF', date: '2024-11-01', size: "32KB" },
        { id: 2, name: 'Document2.docx', type: 'Word Document', date: '2024-11-02', size: "52KB" },
        // Add more mock data as needed
    ]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDocs, setFilteredDocs] = useState(documents);
    const [selectedFile, setSelectedFile] = useState(null);

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

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';

        const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const k = 1000;
        const dm = 2;

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const size = Math.round(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) * 100) / 100;

        return `${size} ${units[i]}`;
    }

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

        const newDoc = {
            id: documents.length + 1,
            name: selectedFile.name,
            type: getFileType(selectedFile.name),
            date: new Date().toISOString().split('T')[0],
            size: formatFileSize(selectedFile.size),
        };
        setDocuments(prevDocs => [...prevDocs, newDoc]);
        setSelectedFile(null);
        alert(`File "${selectedFile.name}" uploaded successfully.`);
    };

    const handleDelete = (id) => {

        if(confirm("Are you sure do you want to delete the file from the list?") == true){
            const updatedDocuments = documents.filter(doc => doc.id !== id);
            setDocuments(updatedDocuments);
        }
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
                        <b>Termination Date: </b> {selectedEmployee ? dayjs(selectedEmployee?.terminationDate).format("DD MMMM YYYY") : ""}
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
                                <TableCell sx={{ color: '#e0e0e0' }}>Document Name</TableCell>
                                <TableCell sx={{ color: '#e0e0e0' }}>Document Type</TableCell>
                                <TableCell sx={{ color: '#e0e0e0' }}>Size</TableCell>
                                <TableCell sx={{ color: '#e0e0e0' }}>Upload Date</TableCell>
                                <TableCell sx={{ color: '#e0e0e0' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDocs.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell sx={{ color: '#e0e0e0' }}>{doc.name}</TableCell>
                                    <TableCell sx={{ color: '#e0e0e0' }}>{doc.type}</TableCell>
                                    <TableCell sx={{ color: '#e0e0e0' }}>{doc.size}</TableCell>
                                    <TableCell sx={{ color: '#e0e0e0' }}>{doc.date}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleDelete(doc.id)}
                                            sx={{ color: 'red' }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Stack>
    );
}

export default TableDocument;
