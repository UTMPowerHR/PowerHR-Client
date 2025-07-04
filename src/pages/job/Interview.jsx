'use client';

import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    Alert,
    CircularProgress,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useScheduleInterviewMutation } from '@features/job/jobApiSlice';

function Interview({ open, onClose, applicant, jobTitle }) {
    const [interviewType, setInterviewType] = useState('online');
    const [interviewDate, setInterviewDate] = useState(dayjs().add(1, 'day'));
    const [address, setAddress] = useState('');
    const [meetLink, setMeetLink] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [scheduleInterview, { isLoading }] = useScheduleInterviewMutation();

    const generateMeetLink = () => {
        // For now, we'll create a placeholder link
        // In production, you'd integrate with Google Calendar API
        const meetId = Math.random().toString(36).substring(2, 15);
        const link = `https://meet.google.com/${meetId}`;
        setMeetLink(link);
    };

    const handleScheduleInterview = async () => {
        setError('');

        try {
            // Validate required fields
            if (interviewType === 'physical' && !address.trim()) {
                throw new Error('Address is required for physical interviews');
            }
            if (interviewType === 'online' && !meetLink.trim()) {
                throw new Error('Please generate a meeting link for online interviews');
            }

            // Map frontend types to backend enum values
            const interviewData = {
                interviewType: interviewType, // Send the original value directly
                interviewDate: interviewDate.toISOString(),
                address: interviewType === 'physical' ? address : undefined,
                meetLink: interviewType === 'online' ? meetLink : undefined,
                additionalNotes: additionalNotes,
            };

            await scheduleInterview({
                applicationId: applicant._id,
                interviewData,
            }).unwrap();

            setSuccess(true);

            // Close dialog after 2 seconds
            setTimeout(() => {
                onClose();
                setSuccess(false);
                // Reset form
                setInterviewType('online');
                setInterviewDate(dayjs().add(1, 'day'));
                setAddress('');
                setMeetLink('');
                setAdditionalNotes('');
            }, 2000);
        } catch (err) {
            setError(err.data?.error || err.message || 'Failed to schedule interview');
        }
    };

    // Early return if no applicant data
    if (!applicant || !applicant.applicant) {
        return null;
    }

    // Safely extract applicant data
    const applicantData = applicant.applicant;
    const resumeData = applicantData.resume || {};
    const basicDetail = resumeData.basicDetail || {};

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Schedule Interview - {basicDetail.name || 'Unknown Applicant'}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Interview scheduled successfully! Email sent to applicant.
                        </Alert>
                    )}

                    <Grid container spacing={3}>
                        {/* Applicant Info Card */}
                        <Grid item xs={12}>
                            <Card variant="outlined">
                                <CardHeader title="Applicant Information" />
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="textSecondary">
                                                Name
                                            </Typography>
                                            <Typography variant="body1">{basicDetail.name || 'N/A'}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="textSecondary">
                                                Email
                                            </Typography>
                                            <Typography variant="body1">{basicDetail.email || 'N/A'}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="textSecondary">
                                                Phone
                                            </Typography>
                                            <Typography variant="body1">{basicDetail.phone || 'N/A'}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="textSecondary">
                                                Position
                                            </Typography>
                                            <Typography variant="body1">{jobTitle || 'N/A'}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="textSecondary">
                                                Gender
                                            </Typography>
                                            <Typography variant="body1">{applicantData.gender || 'N/A'}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="textSecondary">
                                                Education
                                            </Typography>
                                            <Typography variant="body1">
                                                {resumeData.highestQualification || 'N/A'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Interview Type Selection */}
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <Typography variant="h6" gutterBottom>
                                    Interview Type
                                </Typography>
                                <RadioGroup
                                    value={interviewType}
                                    onChange={(e) => setInterviewType(e.target.value)}
                                    row
                                >
                                    <FormControlLabel value="online" control={<Radio />} label="Online Interview" />
                                    <FormControlLabel value="physical" control={<Radio />} label="Physical Interview" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        {/* Date and Time Selection */}
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Interview Date & Time"
                                    value={interviewDate}
                                    onChange={(newValue) => setInterviewDate(newValue)}
                                    minDateTime={dayjs()}
                                    sx={{ width: '100%' }}
                                />
                            </LocalizationProvider>
                        </Grid>

                        {/* Conditional Fields based on Interview Type */}
                        {interviewType === 'physical' && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Interview Address"
                                    multiline
                                    rows={3}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter the complete address where the interview will be conducted"
                                    required
                                />
                            </Grid>
                        )}

                        {interviewType === 'online' && (
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                                    <TextField
                                        fullWidth
                                        label="Meeting Link"
                                        value={meetLink}
                                        onChange={(e) => setMeetLink(e.target.value)}
                                        placeholder="Google Meet link will appear here"
                                        required
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={generateMeetLink}
                                        sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
                                    >
                                        Generate Link
                                    </Button>
                                </Box>
                                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                                    Click Generate Link to create a Google Meet link, or paste your own meeting link
                                </Typography>
                            </Grid>
                        )}

                        {/* Additional Notes */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Additional Notes (Optional)"
                                multiline
                                rows={3}
                                value={additionalNotes}
                                onChange={(e) => setAdditionalNotes(e.target.value)}
                                placeholder="Any additional information for the applicant..."
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleScheduleInterview}
                    variant="contained"
                    disabled={isLoading}
                    startIcon={isLoading && <CircularProgress size={20} />}
                >
                    {isLoading ? 'Scheduling...' : 'Schedule Interview'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// PropTypes validation to fix the ESLint error
Interview.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    applicant: PropTypes.shape({
        _id: PropTypes.string,
        applicant: PropTypes.shape({
            gender: PropTypes.string,
            resume: PropTypes.shape({
                basicDetail: PropTypes.shape({
                    name: PropTypes.string,
                    email: PropTypes.string,
                    phone: PropTypes.string,
                }),
                highestQualification: PropTypes.string,
                totalExperience: PropTypes.number,
                technicalSkills: PropTypes.object,
                softSkills: PropTypes.object,
                languages: PropTypes.object,
            }),
        }),
        createdAt: PropTypes.string,
    }),
    jobTitle: PropTypes.string,
};

// Default props
Interview.defaultProps = {
    applicant: null,
    jobTitle: '',
};

export default Interview;
