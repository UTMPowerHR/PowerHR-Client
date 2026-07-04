import React, { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Example() {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('File ready for upload:', selectedFile.name);
      alert(`File "${selectedFile.name}" selected.`);
      // Mock uploading process
      setTimeout(() => {
        // After upload, redirect to the document list page
        navigate('./DocumentList');
      }, 1000);
    } else {
      alert('Please select a file first.');
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{
        backgroundColor: '#1a1a2e', 
        padding: '20px',
        borderRadius: '8px',
        color: '#e0e0e0',
        maxWidth: '400px',
        margin: 'auto',
        textAlign: 'center'
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Upload Document
      </Typography>
      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        style={{
          marginBottom: '1em',
          color: '#e0e0e0',
          border: '1px solid #1f4068',
          padding: '10px',
          backgroundColor: '#162447',
          borderRadius: '4px'
        }}
      />
      <Button 
        variant="contained" 
        onClick={handleUpload}
        sx={{
          backgroundColor: '#1f4068',
          '&:hover': {
            backgroundColor: '#1b3b5f'
          },
          color: '#fff',
          width: '100%',
          textTransform: 'none'
        }}
      >
        Upload
      </Button>
    </Paper>
  );
}

export default Example;
