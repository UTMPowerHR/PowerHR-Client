'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Stack,
    Alert,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
    Card,
    CardContent,
    Divider,
} from '@mui/material';
import { CloudUpload, Description, Edit, Save } from '@mui/icons-material';
import { useExtractResumeMutation, useSaveExtractedResumeMutation } from '@features/applicant/applicantApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { setResume } from '@features/applicant/applicantSlice';
import { useNavigate } from 'react-router-dom';
import PATHS from '@constants/routes/paths';
import ExtractedResumeForm from './component/ExtractedResumeForm';

const steps = ['Upload Resume', 'Review & Edit', 'Save'];

export default function ResumeExtractor() {
    const [activeStep, setActiveStep] = useState(0);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [extractedData, setExtractedData] = useState(null);
    const [error, setError] = useState('');

    const [extractResume, { isLoading: extracting }] = useExtractResumeMutation();
    const [saveExtractedResume, { isLoading: saving }] = useSaveExtractedResumeMutation();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userId = useSelector((state) => state.auth.user._id);

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        setError('');

        if (rejectedFiles.length > 0) {
            setError('Please upload a valid PDF file (max 10MB)');
            return;
        }

        const file = acceptedFiles[0];
        if (file) {
            setUploadedFile(file);
            setActiveStep(0);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10MB
    });

    // In your ResumeExtractor.jsx, update the handleExtractResume function:
    const handleExtractResume = async () => {
        if (!uploadedFile) return;

        try {
            setError('');

            const formData = new FormData();
            formData.append('file', uploadedFile);

            console.log('=== FRONTEND DEBUG ===');
            console.log('Making API call...');

            const result = await extractResume({ formData, userId }).unwrap();

            console.log('=== API RESPONSE RECEIVED ===');
            console.log('Full result:', result);

            if (result.success && result.extractedData) {
                console.log('Setting extracted data...');
                // Ensure the extracted data has the proper structure
                const processedData = processExtractedData(result.extractedData);
                setExtractedData(processedData);
                setActiveStep(1);
            } else {
                console.error('No extracted data in response');
                setError('No data was extracted from the resume');
            }
        } catch (err) {
            console.error('API call failed:', err);
            setError(err.data?.message || 'Failed to extract resume data. Please try again.');
        }
    };

    // Add this helper function to process extracted data
    const processExtractedData = (data) => {
        // Ensure all required fields exist with proper structure
        return {
            ...data,
            objective: {
                ...data.objective,
                value:
                    typeof data.objective?.value === 'string' ? [data.objective.value] : data.objective?.value || [''],
            },
            summary: {
                ...data.summary,
                value: typeof data.summary?.value === 'string' ? [data.summary.value] : data.summary?.value || [''],
            },
            template: {
                name: 'modern',
                column: 2,
                settings: {
                    titleColor: '#2c3e50',
                    contentColor: '#34495e',
                    backgroundColor1: '#ffffff',
                    backgroundColor2: '#f8f9fa',
                    backgroundColor3: '#e9ecef',
                },
                pages: [
                    {
                        columns: [
                            {
                                list: [
                                    { name: 'summary', typeCard: 'string' },
                                    { name: 'experience', typeCard: 'timeline' },
                                    { name: 'education', typeCard: 'timeline' },
                                ],
                            },
                            {
                                list: [
                                    { name: 'technicalSkills', typeCard: 'score' },
                                    { name: 'softSkills', typeCard: 'list' },
                                    { name: 'languages', typeCard: 'score' },
                                ],
                            },
                        ],
                    },
                ],
            },
        };
    };

    const handleSaveExtractedData = async (finalData) => {
        try {
            setError('');
            await saveExtractedResume({
                userId,
                resumeData: finalData,
                originalFileName: uploadedFile.name,
            }).unwrap();

            // Update Redux store with the extracted data
            dispatch(setResume(finalData));

            setActiveStep(2);

            // Navigate to resume builder after a short delay
            setTimeout(() => {
                navigate(PATHS.RESUME.BUILDER);
            }, 2000);
        } catch (err) {
            setError(err.data?.message || 'Failed to save extracted data. Please try again.');
        }
    };

    const handleStartOver = () => {
        setActiveStep(0);
        setUploadedFile(null);
        setExtractedData(null);
        setError('');
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Resume Extractor
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
                    Upload your resume in PDF format and we will extract the information to help you build your profile
                </Typography>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Step 0: Upload Resume */}
                {activeStep === 0 && (
                    <Stack spacing={3}>
                        <Card>
                            <CardContent>
                                <Box
                                    {...getRootProps()}
                                    sx={{
                                        border: '2px dashed',
                                        borderColor: isDragActive ? 'primary.main' : 'grey.300',
                                        borderRadius: 2,
                                        p: 6,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            bgcolor: 'action.hover',
                                        },
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h6" gutterBottom>
                                        {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        or click to browse files
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Supports PDF files up to 10MB
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>

                        {uploadedFile && (
                            <Card>
                                <CardContent>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Description color="primary" />
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle1">{uploadedFile.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </Typography>
                                        </Box>
                                        <Button
                                            variant="contained"
                                            onClick={handleExtractResume}
                                            disabled={extracting}
                                            startIcon={extracting ? <CircularProgress size={20} /> : <Edit />}
                                        >
                                            {extracting ? 'Extracting...' : 'Extract Data'}
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        )}
                    </Stack>
                )}

                {/* Step 1: Review & Edit */}
                {activeStep === 1 && extractedData && (
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Review & Edit Extracted Information
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Please review the extracted information and fill in any missing details
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                        </Box>

                        <ExtractedResumeForm
                            initialData={extractedData}
                            onSave={handleSaveExtractedData}
                            onCancel={handleStartOver}
                            isLoading={saving}
                        />
                    </Stack>
                )}

                {/* Step 2: Success */}
                {activeStep === 2 && (
                    <Stack spacing={3} alignItems="center">
                        <Box sx={{ textAlign: 'center' }}>
                            <Save sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                Resume Data Saved Successfully!
                            </Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                Your resume information has been extracted and saved. You will be redirected to the
                                Resume Builder shortly.
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={2}>
                            <Button variant="outlined" onClick={handleStartOver}>
                                Extract Another Resume
                            </Button>
                            <Button variant="contained" onClick={() => navigate(PATHS.RESUME.BUILDER)}>
                                Go to Resume Builder
                            </Button>
                        </Stack>
                    </Stack>
                )}
            </Paper>
        </Container>
    );
}
