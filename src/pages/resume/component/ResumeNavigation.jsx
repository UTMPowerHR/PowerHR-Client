'use client';

import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { Build, Upload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PATHS from '@constants/routes/paths';

export default function ResumeNavigation() {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
            <Card sx={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(PATHS.RESUME.EXTRACTOR)}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Upload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        Extract from PDF
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Upload your existing resume and we will extract the information automatically
                    </Typography>
                    <Button variant="contained" fullWidth>
                        Start Extraction
                    </Button>
                </CardContent>
            </Card>

            <Card sx={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(PATHS.RESUME.BUILDER)}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Build sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        Build from Scratch
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Create your resume from scratch using our interactive builder
                    </Typography>
                    <Button variant="outlined" fullWidth>
                        Start Building
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}
