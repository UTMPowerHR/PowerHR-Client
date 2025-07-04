'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Slider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
    IconButton,
    Chip,
} from '@mui/material';
import { Close as CloseIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetPostingListByCompanyIdQuery, useFilterApplicationsMutation } from '@features/job/jobApiSlice';
import Interview from './Interview';

export default function Filter() {
    const companyId = useSelector((state) => state.auth.user.company);
    const { data: postingList, isLoading: isPostingLoading } = useGetPostingListByCompanyIdQuery(companyId);
    const [filterApplications, { data: filteredApplications, error, isLoading: isFiltering }] =
        useFilterApplicationsMutation();

    // console.log('postingList', postingList);
    // console.log('filteredApplications', filteredApplications);

    const [newPosting, setNewPosting] = useState(false);
    const [selectedJobTitle, setSelectedJobTitle] = useState('');

    // Separate current filters (what user is selecting) from applied filters
    const [currentRequirements, setCurrentRequirements] = useState({
        qualification: 'Degree',
        experience: {
            min: 0,
            max: 10,
        },
        languages: [],
        technicalSkills: [],
        softSkills: [],
        gender: 'All',
        rejectedApplications: [],
        date: {
            year: null,
            month: null,
        },
    });

    // eslint-disable-next-line no-unused-vars
    const [requirements, setRequirements] = useState({
        qualification: 'Degree',
        experience: {
            min: 0,
            max: 10,
        },
        languages: [],
        technicalSkills: [],
        softSkills: [],
        gender: 'All',
        rejectedApplications: [],
        date: {
            year: null,
            month: null,
        },
    });

    const [interviewDialog, setInterviewDialog] = useState({
        open: false,
        applicant: null,
        jobTitle: '',
    });

    // New state for applicant detail dialog
    const [applicantDetailDialog, setApplicantDetailDialog] = useState({
        open: false,
        applicant: null,
    });

    // Add this state for managing resume data
    // eslint-disable-next-line no-unused-vars
    const [selectedApplicantResume, setSelectedApplicantResume] = useState(null);
    const [resumeLoading, setResumeLoading] = useState(false);

    // Reset newPosting on error
    useEffect(() => {
        if (error) {
            setNewPosting(false);
            // console.error('Filter failed:', error);
        }
    }, [error]);

    // Fetch initial applications when postingList is loaded
    useEffect(() => {
        if (postingList && postingList.length > 0) {
            filterApplications({
                postingId: postingList[0]._id,
                bodyRequirements: {}, // Pass an empty object instead of null
            });
            setSelectedJobTitle(postingList[0]._id); // Set to _id, not job.title
            setNewPosting(true);
        } else {
            // console.error('No postings found for the company');
        }
    }, [postingList, filterApplications]);

    // Update requirements when filteredApplications is loaded
    useEffect(() => {
        if (filteredApplications && newPosting) {
            setRequirements(filteredApplications.requirements);
            setCurrentRequirements(filteredApplications.requirements);
            setNewPosting(false);
        }
    }, [filteredApplications, newPosting]);

    // Remove the automatic filtering useEffect - we'll make it manual now
    // useEffect(() => {
    //     if (!newPosting) {
    //         filterApplications({
    //             postingId: selectedJobTitle,
    //             bodyRequirements: requirements,
    //         });
    //         console.log('hehe', selectedJobTitle, 'haha', requirements);
    //     } else {
    //         console.error('Invalid or missing job title');
    //     }
    // }, [requirements, selectedJobTitle]);

    // Handle loading and no-data states
    if (isPostingLoading) {
        return <div>Loading...</div>;
    }

    if (!postingList || postingList.length === 0) {
        return <div>No job postings found for this company.</div>;
    }

    const handleScheduleInterview = (application) => {
        const selectedPosting = postingList?.find((posting) => posting._id === selectedJobTitle);
        setInterviewDialog({
            open: true,
            applicant: application,
            jobTitle: selectedPosting?.job?.title || 'Unknown Position',
        });
    };

    // New function to handle manual filter application
    const handleApplyFilters = () => {
        setRequirements({ ...currentRequirements });
        filterApplications({
            postingId: selectedJobTitle,
            bodyRequirements: currentRequirements,
        });
        // console.log('Applying filters:', selectedJobTitle, currentRequirements);
    };

    // New function to clear filters
    const handleClearFilters = () => {
        const defaultRequirements = {
            qualification: 'Degree',
            experience: { min: 0, max: 10 },
            languages: [],
            technicalSkills: [],
            softSkills: [],
            gender: 'All',
            rejectedApplications: [],
            date: { year: null, month: null },
        };
        setCurrentRequirements(defaultRequirements);
        setRequirements(defaultRequirements);
        filterApplications({
            postingId: selectedJobTitle,
            bodyRequirements: defaultRequirements,
        });
    };

    // Update the handleViewApplicant function
    const handleViewApplicant = async (application) => {
        setApplicantDetailDialog({
            open: true,
            applicant: application,
        });

        // Fetch resume data for the selected applicant
        setResumeLoading(true);
        try {
            // The resume data should be fetched using the applicant's user ID
            // eslint-disable-next-line no-unused-vars
            const applicantUserId = application.applicant._id;
            // Note: We'll need to make a direct API call since we can't use the hook conditionally
            // For now, we'll use the existing resume data from the application object
            setSelectedApplicantResume(application.applicant.resume);
        } catch (error) {
            // console.error('Error fetching resume:', error);
        } finally {
            setResumeLoading(false);
        }
    };

    // New function to handle reject with current requirements
    const handleRejectApplication = (applicationId) => {
        const updatedRequirements = {
            ...currentRequirements,
            rejectedApplications: [...currentRequirements.rejectedApplications, applicationId],
        };

        setCurrentRequirements(updatedRequirements);

        // ⚠️ Important: Call filterApplications manually here
        filterApplications({
            postingId: selectedJobTitle,
            bodyRequirements: updatedRequirements,
        });
    };

    // New function to handle unreject with current requirements
    const handleUnrejectApplication = (applicationId) => {
        const updatedRequirements = {
            ...currentRequirements,
            rejectedApplications: currentRequirements.rejectedApplications.filter((id) => id !== applicationId),
        };

        setCurrentRequirements(updatedRequirements);

        // Refilter after unrejecting
        filterApplications({
            postingId: selectedJobTitle,
            bodyRequirements: updatedRequirements,
        });
    };

    // Helper function to check if there are any results
    const hasAnyResults = () => {
        if (!filteredApplications) return false;
        return (
            (filteredApplications.qualified?.length || 0) +
                (filteredApplications.overqualified?.length || 0) +
                (filteredApplications.underqualified?.length || 0) +
                (filteredApplications.rejected?.length || 0) +
                (filteredApplications.probable?.length || 0) >
            0
        );
    };

    // Replace the existing ApplicantDetailDialog component
    const ApplicantDetailDialog = () => (
        <Dialog
            open={applicantDetailDialog.open}
            onClose={() => {
                setApplicantDetailDialog({ open: false, applicant: null });
                setSelectedApplicantResume(null);
            }}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                        {applicantDetailDialog.applicant?.applicant?.resume?.basicDetail?.name || 'Applicant Details'}
                    </Typography>
                    <IconButton
                        onClick={() => {
                            setApplicantDetailDialog({ open: false, applicant: null });
                            setSelectedApplicantResume(null);
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                {resumeLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <Typography>Loading resume data...</Typography>
                    </Box>
                ) : (
                    applicantDetailDialog.applicant && (
                        <Box>
                            <Accordion defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">Basic Information</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                Name
                                            </Typography>
                                            <Typography variant="body1">
                                                {applicantDetailDialog.applicant.applicant.resume?.basicDetail?.name ||
                                                    'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                Email
                                            </Typography>
                                            <Typography variant="body1">
                                                {applicantDetailDialog.applicant.applicant.resume?.basicDetail?.email ||
                                                    'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                Phone
                                            </Typography>
                                            <Typography variant="body1">
                                                {applicantDetailDialog.applicant.applicant.resume?.basicDetail?.phone ||
                                                    'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                Location
                                            </Typography>
                                            <Typography variant="body1">
                                                {applicantDetailDialog.applicant.applicant.resume?.basicDetail
                                                    ?.location || 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                Gender
                                            </Typography>
                                            <Typography variant="body1">
                                                {applicantDetailDialog.applicant.applicant.gender || 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                Education Level
                                            </Typography>
                                            <Typography variant="body1">
                                                {applicantDetailDialog.applicant.applicant.resume
                                                    ?.highestQualification || 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                Total Experience
                                            </Typography>
                                            <Typography variant="body1">
                                                {applicantDetailDialog.applicant.applicant.resume?.totalExperience || 0}{' '}
                                                years
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                Application Date
                                            </Typography>
                                            <Typography variant="body1">
                                                {dayjs(applicantDetailDialog.applicant.createdAt).format('DD/MM/YYYY')}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>

                            {/* Professional Summary */}
                            {applicantDetailDialog.applicant.applicant.resume?.summary && (
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h6">Professional Summary</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body1">
                                            {Array.isArray(
                                                applicantDetailDialog.applicant.applicant.resume.summary.value,
                                            )
                                                ? applicantDetailDialog.applicant.applicant.resume.summary.value.join(
                                                      ' ',
                                                  )
                                                : applicantDetailDialog.applicant.applicant.resume.summary.value ||
                                                  'No summary available'}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            )}

                            {/* Skills Section */}
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">Skills</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Technical Skills
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {applicantDetailDialog.applicant.applicant.resume?.technicalSkills
                                                    ?.value &&
                                                    Array.isArray(
                                                        applicantDetailDialog.applicant.applicant.resume.technicalSkills
                                                            .value,
                                                    ) &&
                                                    applicantDetailDialog.applicant.applicant.resume.technicalSkills.value.map(
                                                        (skill, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={`${skill.name}${skill.level ? ` (${skill.level})` : ''}`}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                            />
                                                        ),
                                                    )}
                                                {(!applicantDetailDialog.applicant.applicant.resume?.technicalSkills
                                                    ?.value ||
                                                    !Array.isArray(
                                                        applicantDetailDialog.applicant.applicant.resume.technicalSkills
                                                            .value,
                                                    ) ||
                                                    applicantDetailDialog.applicant.applicant.resume.technicalSkills
                                                        .value.length === 0) && (
                                                    <Typography variant="body2" color="textSecondary">
                                                        No technical skills listed
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Soft Skills
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {applicantDetailDialog.applicant.applicant.resume?.softSkills?.value &&
                                                    Array.isArray(
                                                        applicantDetailDialog.applicant.applicant.resume.softSkills
                                                            .value,
                                                    ) &&
                                                    applicantDetailDialog.applicant.applicant.resume.softSkills.value.map(
                                                        (skill, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={skill.name}
                                                                size="small"
                                                                color="secondary"
                                                                variant="outlined"
                                                            />
                                                        ),
                                                    )}
                                                {(!applicantDetailDialog.applicant.applicant.resume?.softSkills
                                                    ?.value ||
                                                    !Array.isArray(
                                                        applicantDetailDialog.applicant.applicant.resume.softSkills
                                                            .value,
                                                    ) ||
                                                    applicantDetailDialog.applicant.applicant.resume.softSkills.value
                                                        .length === 0) && (
                                                    <Typography variant="body2" color="textSecondary">
                                                        No soft skills listed
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Languages
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {applicantDetailDialog.applicant.applicant.resume?.languages?.value &&
                                                    Array.isArray(
                                                        applicantDetailDialog.applicant.applicant.resume.languages
                                                            .value,
                                                    ) &&
                                                    applicantDetailDialog.applicant.applicant.resume.languages.value.map(
                                                        (language, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={`${language.name}${language.level ? ` (${language.level})` : ''}`}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        ),
                                                    )}
                                                {(!applicantDetailDialog.applicant.applicant.resume?.languages?.value ||
                                                    !Array.isArray(
                                                        applicantDetailDialog.applicant.applicant.resume.languages
                                                            .value,
                                                    ) ||
                                                    applicantDetailDialog.applicant.applicant.resume.languages.value
                                                        .length === 0) && (
                                                    <Typography variant="body2" color="textSecondary">
                                                        No languages listed
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>

                            {/* Work Experience */}
                            {applicantDetailDialog.applicant.applicant.resume?.experience?.value &&
                                Array.isArray(applicantDetailDialog.applicant.applicant.resume.experience.value) &&
                                applicantDetailDialog.applicant.applicant.resume.experience.value.length > 0 && (
                                    <Accordion>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="h6">Work Experience</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Stack spacing={2}>
                                                {applicantDetailDialog.applicant.applicant.resume.experience.value.map(
                                                    (exp, index) => (
                                                        <Box
                                                            key={index}
                                                            sx={{ pl: 2, borderLeft: '3px solid #1976d2' }}
                                                        >
                                                            <Typography variant="subtitle1" fontWeight="bold">
                                                                {exp.title || 'Position not specified'}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {exp.company || 'Company not specified'}
                                                                {exp.location && ` • ${exp.location}`}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {exp.date?.from || 'Start date not specified'} -{' '}
                                                                {exp.date?.to || 'End date not specified'}
                                                            </Typography>
                                                            {exp.description && Array.isArray(exp.description) && (
                                                                <Box sx={{ mt: 1 }}>
                                                                    {exp.description.map(
                                                                        (desc, descIndex) =>
                                                                            desc && (
                                                                                <Typography
                                                                                    key={descIndex}
                                                                                    variant="body2"
                                                                                    sx={{ mt: 0.5 }}
                                                                                >
                                                                                    • {desc}
                                                                                </Typography>
                                                                            ),
                                                                    )}
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    ),
                                                )}
                                            </Stack>
                                        </AccordionDetails>
                                    </Accordion>
                                )}

                            {/* Education */}
                            {applicantDetailDialog.applicant.applicant.resume?.education?.value &&
                                Array.isArray(applicantDetailDialog.applicant.applicant.resume.education.value) &&
                                applicantDetailDialog.applicant.applicant.resume.education.value.length > 0 && (
                                    <Accordion>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="h6">Education</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Stack spacing={2}>
                                                {applicantDetailDialog.applicant.applicant.resume.education.value.map(
                                                    (edu, index) => (
                                                        <Box
                                                            key={index}
                                                            sx={{ pl: 2, borderLeft: '3px solid #4caf50' }}
                                                        >
                                                            <Typography variant="subtitle1" fontWeight="bold">
                                                                {edu.degree || 'Degree not specified'}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {edu.institution || 'Institution not specified'}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {edu.date?.from || 'Start date not specified'} -{' '}
                                                                {edu.date?.to || 'End date not specified'}
                                                            </Typography>
                                                        </Box>
                                                    ),
                                                )}
                                            </Stack>
                                        </AccordionDetails>
                                    </Accordion>
                                )}

                            {/* Website URLs */}
                            {applicantDetailDialog.applicant.applicant.resume?.basicDetail?.websiteUrl && (
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h6">Links & Portfolio</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={2}>
                                            {applicantDetailDialog.applicant.applicant.resume.basicDetail.websiteUrl
                                                .linkedin && (
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        LinkedIn
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        component="a"
                                                        href={
                                                            applicantDetailDialog.applicant.applicant.resume.basicDetail
                                                                .websiteUrl.linkedin
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        sx={{ color: 'primary.main', textDecoration: 'none' }}
                                                    >
                                                        {
                                                            applicantDetailDialog.applicant.applicant.resume.basicDetail
                                                                .websiteUrl.linkedin
                                                        }
                                                    </Typography>
                                                </Grid>
                                            )}
                                            {applicantDetailDialog.applicant.applicant.resume.basicDetail.websiteUrl
                                                .portfolio && (
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        Portfolio
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        component="a"
                                                        href={
                                                            applicantDetailDialog.applicant.applicant.resume.basicDetail
                                                                .websiteUrl.portfolio
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        sx={{ color: 'primary.main', textDecoration: 'none' }}
                                                    >
                                                        {
                                                            applicantDetailDialog.applicant.applicant.resume.basicDetail
                                                                .websiteUrl.portfolio
                                                        }
                                                    </Typography>
                                                </Grid>
                                            )}
                                            {applicantDetailDialog.applicant.applicant.resume.basicDetail.websiteUrl
                                                .github && (
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        GitHub
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        component="a"
                                                        href={
                                                            applicantDetailDialog.applicant.applicant.resume.basicDetail
                                                                .websiteUrl.github
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        sx={{ color: 'primary.main', textDecoration: 'none' }}
                                                    >
                                                        {
                                                            applicantDetailDialog.applicant.applicant.resume.basicDetail
                                                                .websiteUrl.github
                                                        }
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            )}
                        </Box>
                    )
                )}
            </DialogContent>
        </Dialog>
    );

    return (
        <Grid container sx={{ flexGrow: 1 }} spacing={5}>
            <Grid item xs={12}>
                <Stack maxWidth="sm" spacing={3}>
                    <Typography variant="h4">Applications {isFiltering && '(Filtering...)'} </Typography>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                    <Grid container sx={{ flexGrow: 1 }} p={2} spacing={2}>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel id="job-title-label">Select Job Title</InputLabel>
                                <Select
                                    labelId="job-title-label"
                                    id="job-title-select"
                                    value={selectedJobTitle}
                                    onChange={(e) => {
                                        setSelectedJobTitle(e.target.value);
                                        // Don't auto-filter anymore, just update the selection
                                        setNewPosting(true);
                                    }}
                                >
                                    {postingList?.map((posting) => (
                                        <MenuItem value={posting._id} key={posting._id}>
                                            {posting.job.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel id="education-label">Select Education</InputLabel>
                                <Select
                                    labelId="education-label"
                                    id="education-select"
                                    value={currentRequirements.qualification}
                                    onChange={(e) =>
                                        setCurrentRequirements({
                                            ...currentRequirements,
                                            qualification: e.target.value,
                                        })
                                    }
                                >
                                    <MenuItem value="SPM">SPM</MenuItem>
                                    <MenuItem value="Diploma">STPM, Diploma, Matriculation, A-Level</MenuItem>
                                    <MenuItem value="Degree">Bachelor</MenuItem>
                                    <MenuItem value="Master">Master</MenuItem>
                                    <MenuItem value="PhD">PhD</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel id="gender-label">Select Gender</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender-select"
                                    value={currentRequirements.gender}
                                    onChange={(e) =>
                                        setCurrentRequirements({
                                            ...currentRequirements,
                                            gender: e.target.value,
                                        })
                                    }
                                >
                                    <MenuItem value="All">All</MenuItem>
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label={'Application after'}
                                    views={['month', 'year']}
                                    sx={{ width: '100%' }}
                                    value={
                                        currentRequirements.date.year && currentRequirements.date.month
                                            ? dayjs(
                                                  `${currentRequirements.date.year}-${currentRequirements.date.month}`,
                                              )
                                            : null
                                    }
                                    onChange={(newValue) => {
                                        if (newValue) {
                                            setCurrentRequirements({
                                                ...currentRequirements,
                                                date: {
                                                    year: newValue.format('YYYY'),
                                                    month: newValue.format('MM'),
                                                },
                                            });
                                        } else {
                                            setCurrentRequirements({
                                                ...currentRequirements,
                                                date: {
                                                    year: null,
                                                    month: null,
                                                },
                                            });
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel id="language-label">Select Languages</InputLabel>
                                <Select
                                    labelId="language-label"
                                    id="language-select"
                                    multiple
                                    value={currentRequirements.languages}
                                    onChange={(e) =>
                                        setCurrentRequirements({ ...currentRequirements, languages: e.target.value })
                                    }
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    renderValue={(selected) => {
                                        if (selected.length === 0) {
                                            return <em>None</em>;
                                        }
                                        return selected
                                            .map((language) => language[0].toUpperCase() + language.slice(1))
                                            .join(', ');
                                    }}
                                    fullWidth
                                    disabled={filteredApplications?.options.languages.length === 0}
                                >
                                    {filteredApplications?.options.languages.map((language) => (
                                        <MenuItem key={language} value={language.toLowerCase()}>
                                            <Checkbox
                                                checked={
                                                    currentRequirements.languages.indexOf(language.toLowerCase()) > -1
                                                }
                                            />
                                            {language[0].toUpperCase() + language.slice(1).toLowerCase()}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel id="technical-skills-label">Select Technical Skills</InputLabel>
                                <Select
                                    labelId="technical-skills-label"
                                    id="technical-skills-select"
                                    multiple
                                    value={currentRequirements.technicalSkills}
                                    onChange={(e) =>
                                        setCurrentRequirements({
                                            ...currentRequirements,
                                            technicalSkills: e.target.value,
                                        })
                                    }
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    renderValue={(selected) => {
                                        if (selected.length === 0) {
                                            return <em>None</em>;
                                        }
                                        return selected
                                            .map((skill) => skill[0].toUpperCase() + skill.slice(1))
                                            .join(', ');
                                    }}
                                    fullWidth
                                    disabled={filteredApplications?.options.technicalSkills.length === 0}
                                >
                                    {filteredApplications?.options.technicalSkills.map((skill) => (
                                        <MenuItem key={skill} value={skill.toLowerCase()}>
                                            <Checkbox
                                                checked={
                                                    currentRequirements.technicalSkills.indexOf(skill.toLowerCase()) >
                                                    -1
                                                }
                                            />
                                            {skill[0].toUpperCase() + skill.slice(1).toLowerCase()}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel id="soft-skills-label">Select Soft Skills</InputLabel>
                                <Select
                                    labelId="soft-skills-label"
                                    id="soft-skills-select"
                                    multiple
                                    value={currentRequirements.softSkills}
                                    onChange={(e) =>
                                        setCurrentRequirements({ ...currentRequirements, softSkills: e.target.value })
                                    }
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    renderValue={(selected) => {
                                        if (selected.length === 0) {
                                            return <em>None</em>;
                                        }
                                        return selected
                                            .map((skill) => skill[0].toUpperCase() + skill.slice(1))
                                            .join(', ');
                                    }}
                                    fullWidth
                                    disabled={filteredApplications?.options.softSkills.length === 0}
                                >
                                    {filteredApplications?.options.softSkills.map((skill) => (
                                        <MenuItem key={skill} value={skill.toLowerCase()}>
                                            <Checkbox
                                                checked={
                                                    currentRequirements.softSkills.indexOf(skill.toLowerCase()) > -1
                                                }
                                            />
                                            {skill[0].toUpperCase() + skill.slice(1).toLowerCase()}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs>
                            <Box sx={{ width: '100%', height: '100%' }}>
                                <Stack spacing={2}>
                                    <Typography variant="caption" color="#6C737F">
                                        Experience (years)
                                    </Typography>
                                    <Stack direction="row" spacing={5} alignItems="center" justifyContent="center">
                                        <TextField
                                            label="Min"
                                            value={currentRequirements.experience.min}
                                            onChange={(e) =>
                                                setCurrentRequirements({
                                                    ...currentRequirements,
                                                    experience: {
                                                        ...currentRequirements.experience,
                                                        min: e.target.value,
                                                    },
                                                })
                                            }
                                            type="number"
                                            inputProps={{
                                                min: 0,
                                                max: filteredApplications?.options.experience.max,
                                                step: 1,
                                            }}
                                            InputProps={{
                                                style: { textAlign: 'center' },
                                                endAdornment: <Box sx={{ width: '10px' }} />,
                                            }}
                                            variant="outlined"
                                            size="small"
                                        />
                                        <Slider
                                            value={[
                                                currentRequirements.experience.min,
                                                currentRequirements.experience.max,
                                            ]}
                                            onChange={(e, newValue) =>
                                                setCurrentRequirements({
                                                    ...currentRequirements,
                                                    experience: {
                                                        ...currentRequirements.experience,
                                                        min: newValue[0],
                                                        max: newValue[1],
                                                    },
                                                })
                                            }
                                            min={0}
                                            max={12}
                                            valueLabelDisplay="auto"
                                            aria-labelledby="range-slider"
                                            sx={{ flexGrow: 1 }}
                                        />
                                        <TextField
                                            label="Max"
                                            value={currentRequirements.experience.max}
                                            onChange={(e) =>
                                                setCurrentRequirements({
                                                    ...currentRequirements,
                                                    experience: {
                                                        ...currentRequirements.experience,
                                                        max: e.target.value,
                                                    },
                                                })
                                            }
                                            type="number"
                                            inputProps={{
                                                min: filteredApplications?.options.experience.min,
                                                max: 12,
                                                step: 1,
                                            }}
                                            InputProps={{
                                                style: { textAlign: 'center' },
                                                startAdornment: <Box sx={{ width: '10px' }} />,
                                            }}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Stack>
                                </Stack>
                            </Box>
                        </Grid>

                        {/* New Apply and Clear Filter Buttons */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleApplyFilters}
                                    disabled={isFiltering}
                                >
                                    {isFiltering ? 'Applying...' : 'Apply Filters'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleClearFilters}
                                    disabled={isFiltering}
                                >
                                    Clear Filters
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                {!hasAnyResults() && filteredApplications ? (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                            No Applicants Found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            No applicants match your current filter criteria. Try adjusting your filters and apply
                            again.
                        </Typography>
                    </Paper>
                ) : (
                    <Stack spacing={1}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Suggested Results ({filteredApplications?.qualified.length})</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Gender</TableCell>
                                            <TableCell>Education</TableCell>
                                            <TableCell>Experience</TableCell>
                                            <TableCell>Technical Skills</TableCell>
                                            <TableCell>Soft Skills</TableCell>
                                            <TableCell>Languages</TableCell>
                                            <TableCell>Created At</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredApplications?.qualified.map((application) => (
                                            <TableRow key={application._id}>
                                                <TableCell>{application.applicant.resume.basicDetail.name}</TableCell>
                                                <TableCell>{application.applicant.gender}</TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.highestQualification || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.totalExperience || 0}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.technicalSkills?.value
                                                        .map((skill) => skill.name)
                                                        .join(', ') || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.softSkills?.value
                                                        .map((skill) => skill.name)
                                                        .join(', ') || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.languages?.value
                                                        .map((language) => language.name)
                                                        .join(', ') || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {dayjs(application.createdAt).format('DD/MM/YYYY')}
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            size="small"
                                                            startIcon={<VisibilityIcon />}
                                                            onClick={() => handleViewApplicant(application)}
                                                        >
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleRejectApplication(application._id)}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>
                                    Overqualified Results ({filteredApplications?.overqualified.length})
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Gender</TableCell>
                                            <TableCell>Education</TableCell>
                                            <TableCell>Experience</TableCell>
                                            <TableCell>Technical Skills</TableCell>
                                            <TableCell>Soft Skills</TableCell>
                                            <TableCell>Languages</TableCell>
                                            <TableCell>Created At</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredApplications?.overqualified.map((application) => (
                                            <TableRow key={application._id}>
                                                <TableCell>{application.applicant.resume.basicDetail.name}</TableCell>
                                                <TableCell>{application.applicant.gender}</TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.highestQualification || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.totalExperience || 0}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.technicalSkills?.value
                                                        .map((skill) => skill.name)
                                                        .join(', ') || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.softSkills?.value
                                                        .map((skill) => skill.name)
                                                        .join(', ') || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.languages?.value
                                                        .map((language) => language.name)
                                                        .join(', ') || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {dayjs(application.createdAt).format('DD/MM/YYYY')}
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            size="small"
                                                            startIcon={<VisibilityIcon />}
                                                            onClick={() => handleViewApplicant(application)}
                                                        >
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleRejectApplication(application._id)}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>
                                    Underqualified Results ({filteredApplications?.underqualified.length})
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Gender</TableCell>
                                            <TableCell>Education</TableCell>
                                            <TableCell>Experience</TableCell>
                                            <TableCell>Technical Skills</TableCell>
                                            <TableCell>Soft Skills</TableCell>
                                            <TableCell>Languages</TableCell>
                                            <TableCell>Created At</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredApplications?.underqualified.map((application) => (
                                            <TableRow key={application._id}>
                                                <TableCell>{application.applicant.resume.basicDetail.name}</TableCell>
                                                <TableCell>{application.applicant.gender}</TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.highestQualification || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.totalExperience || 0}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.technicalSkills?.value
                                                        .map((skill) => skill.name)
                                                        .join(', ') || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.softSkills?.value
                                                        .map((skill) => skill.name)
                                                        .join(', ') || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.languages?.value
                                                        .map((language) => language.name)
                                                        .join(', ') || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {dayjs(application.createdAt).format('DD/MM/YYYY')}
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            size="small"
                                                            startIcon={<VisibilityIcon />}
                                                            onClick={() => handleViewApplicant(application)}
                                                        >
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleRejectApplication(application._id)}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Rejected Results ({filteredApplications?.rejected.length})</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Gender</TableCell>
                                            <TableCell>Education</TableCell>
                                            <TableCell>Experience</TableCell>
                                            <TableCell>Technical Skills</TableCell>
                                            <TableCell>Soft Skills</TableCell>
                                            <TableCell>Languages</TableCell>
                                            <TableCell>Created At</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredApplications?.rejected.map((application) => (
                                            <TableRow key={application._id}>
                                                <TableCell>{application.applicant.resume.basicDetail.name}</TableCell>
                                                <TableCell>{application.applicant.gender}</TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.highestQualification || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.totalExperience || 0}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.technicalSkills?.value
                                                        .map((skill) => skill.name)
                                                        .join(', ') || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.softSkills?.value
                                                        .map((skill) => skill.name)
                                                        .join(', ') || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.languages?.value
                                                        .map((language) => language.name)
                                                        .join(', ') || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {dayjs(application.createdAt).format('DD/MM/YYYY')}
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            size="small"
                                                            startIcon={<VisibilityIcon />}
                                                            onClick={() => handleViewApplicant(application)}
                                                        >
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => handleUnrejectApplication(application._id)}
                                                        >
                                                            Unreject
                                                        </Button>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>Probable Results ({filteredApplications?.probable.length})</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Gender</TableCell>
                                            <TableCell>Education</TableCell>
                                            <TableCell>Experience</TableCell>
                                            <TableCell>Technical Skills</TableCell>
                                            <TableCell>Soft Skills</TableCell>
                                            <TableCell>Languages</TableCell>
                                            <TableCell>Created At</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredApplications?.probable.map((application) => (
                                            <TableRow key={application._id}>
                                                <TableCell>{application.applicant.resume.basicDetail.name}</TableCell>
                                                <TableCell>{application.applicant.gender}</TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.highestQualification || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.totalExperience || 0}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.technicalSkills?.value
                                                        .map((skill) => skill.name)
                                                        .join(', ') || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.softSkills?.value
                                                        .map((skill) => skill.name)
                                                        .join(', ') || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {application.applicant.resume.languages?.value
                                                        .map((language) => language.name)
                                                        .join(', ') || 'None'}
                                                </TableCell>
                                                <TableCell>
                                                    {dayjs(application.createdAt).format('DD/MM/YYYY')}
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            size="small"
                                                            startIcon={<VisibilityIcon />}
                                                            onClick={() => handleViewApplicant(application)}
                                                        >
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => handleScheduleInterview(application)}
                                                        >
                                                            Interview
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleRejectApplication(application._id)}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </AccordionDetails>
                        </Accordion>
                    </Stack>
                )}
            </Grid>

            {/* Applicant Detail Dialog */}
            <ApplicantDetailDialog />

            <Interview
                open={interviewDialog.open}
                onClose={() => setInterviewDialog({ open: false, applicant: null, jobTitle: '' })}
                applicant={interviewDialog.applicant}
                jobTitle={interviewDialog.jobTitle}
            />
        </Grid>
    );
}
