import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Checkbox,
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
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    useGetPostingListByCompanyIdQuery,
    useFilterApplicationsMutation,
    useGetApplicationsByPostingQuery,
    useGetAllApplicationsByCompanyQuery,
} from '@features/job/jobApiSlice';

export default function Filter() {
    const companyId = useSelector((state) => state.auth.user.company);
    const postId = '6675b2135d71ba270c232ff8';
    const { data: postingList, isLoading: isPostingLoading } = useGetPostingListByCompanyIdQuery(companyId);
    const { data: applicantList, isLoading: isApplicantLoading } = useGetApplicationsByPostingQuery(postId);
    console.log('postingList', postingList);
    console.log('applicantList', applicantList);

    // useEffect(() => {
    //     if (postingList.length > 0) {
    //         postingList.forEach((posting) => {
    //             const postId = posting._id;
    //             const { data: applicantList } = useGetApplicationsByPostingQuery(postId); // Replace with your logic
    //             console.log('applicantList', applicantList);
    //         });
    //     }
    // }, [postingList]);
    const [filterApplications, { data: filteredApplications, isPostingLoading: isFiltering }] =
        useFilterApplicationsMutation({});

    const [newPosting, setNewPosting] = useState(false);
    const [selectedJobTitle, setSelectedJobTitle] = useState('');
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

    // Fetch initial applications when postingList is loaded
    useEffect(() => {
        if (postingList && postingList.length > 0) {
            filterApplications({
                postingId: postingList[0]._id,
                bodyRequirements: {}, // Pass an empty object instead of null
            });
            console.log('1', postingList[0]._id);
            setSelectedJobTitle(postingList[0]._id); // Set to _id, not job.title
            console.log('2', selectedJobTitle);
            setNewPosting(true);
            console.log(newPosting);
        } else {
            console.error('No postings found for the company');
        }
    }, [postingList, filterApplications]);

    // Update requirements when filteredApplications is loaded
    useEffect(() => {
        if (filteredApplications && newPosting) {
            setRequirements(filteredApplications.requirements);
            setNewPosting(false);
        }
    }, [filteredApplications, newPosting]);

    // Filter applications whenever requirements or selectedJobTitle changes
    useEffect(() => {
        if (!newPosting) {
            filterApplications({
                postingId: selectedJobTitle,
                bodyRequirements: requirements, // Use the current requirements state
            });
            console.log('hehe', selectedJobTitle, 'haha', requirements);
        } else {
            console.error('Invalid or missing job title');
        }
    }, [requirements, selectedJobTitle]);

    // Handle loading and no-data states
    if (isPostingLoading) {
        return <div>Loading...</div>;
    }

    if (!postingList || postingList.length === 0) {
        return <div>No job postings found for this company.</div>;
    }

    return (
        <Grid container sx={{ flexGrow: 1 }} spacing={5}>
            <Grid item xs={12}>
                <Stack maxWidth="sm" spacing={3}>
                    <Typography variant="h4">Applications {isFiltering && '(Filtering...)'}</Typography>
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
                                        filterApplications({ postingId: e.target.value, bodyRequirements: {} });
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
                            {/* Dropdown for Education */}
                            <FormControl fullWidth>
                                <InputLabel id="education-label">Select Education</InputLabel>
                                <Select
                                    labelId="education-label"
                                    id="education-select"
                                    value={requirements.qualification}
                                    onChange={(e) =>
                                        setRequirements({ ...requirements, qualification: e.target.value })
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
                            {/* Dropdown for Gender*/}
                            <FormControl fullWidth>
                                <InputLabel id="gender-label">Select Gender</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender-select"
                                    value={requirements.gender}
                                    onChange={(e) =>
                                        setRequirements({
                                            ...requirements,
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
                                        requirements.date.year && requirements.date.month
                                            ? dayjs(`${requirements.date.year}-${requirements.date.month}`)
                                            : null
                                    }
                                    onChange={(newValue) => {
                                        if (newValue) {
                                            setRequirements({
                                                ...requirements,
                                                date: {
                                                    year: newValue.format('YYYY'),
                                                    month: newValue.format('MM'),
                                                },
                                            });
                                        } else {
                                            setRequirements({
                                                ...requirements,
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
                            {/*Languages Popover*/}
                            <FormControl fullWidth>
                                <InputLabel id="language-label">Select Languages</InputLabel>
                                <Select
                                    labelId="language-label"
                                    id="language-select"
                                    multiple
                                    value={requirements.languages}
                                    onChange={(e) => setRequirements({ ...requirements, languages: e.target.value })}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    renderValue={(selected) => {
                                        if (selected.length === 0) {
                                            return <em>None</em>;
                                        }

                                        //Capitalize first letter of each language
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
                                                checked={requirements.languages.indexOf(language.toLowerCase()) > -1}
                                            />
                                            {language[0].toUpperCase() + language.slice(1).toLowerCase()}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            {/*Technical Skills Popover*/}
                            <FormControl fullWidth>
                                <InputLabel id="technical-skills-label">Select Technical Skills</InputLabel>
                                <Select
                                    labelId="technical-skills-label"
                                    id="technical-skills-select"
                                    multiple
                                    value={requirements.technicalSkills}
                                    onChange={(e) =>
                                        setRequirements({ ...requirements, technicalSkills: e.target.value })
                                    }
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    renderValue={(selected) => {
                                        if (selected.length === 0) {
                                            return <em>None</em>;
                                        }

                                        //Capitalize first letter of each skill
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
                                                checked={requirements.technicalSkills.indexOf(skill.toLowerCase()) > -1}
                                            />
                                            {skill[0].toUpperCase() + skill.slice(1).toLowerCase()}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            {/*Soft Skills Popover*/}
                            <FormControl fullWidth>
                                <InputLabel id="soft-skills-label">Select Soft Skills</InputLabel>
                                <Select
                                    labelId="soft-skills-label"
                                    id="soft-skills-select"
                                    multiple
                                    value={requirements.softSkills}
                                    onChange={(e) => setRequirements({ ...requirements, softSkills: e.target.value })}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    renderValue={(selected) => {
                                        if (selected.length === 0) {
                                            return <em>None</em>;
                                        }

                                        //Capitalize first letter of each skill
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
                                                checked={requirements.softSkills.indexOf(skill.toLowerCase()) > -1}
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
                                            value={requirements.experience.min}
                                            onChange={(e) =>
                                                setRequirements({
                                                    ...requirements,
                                                    experience: {
                                                        ...requirements.experience,
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
                                            value={[requirements.experience.min, requirements.experience.max]}
                                            onChange={(e, newValue) =>
                                                setRequirements({
                                                    ...requirements,
                                                    experience: {
                                                        ...requirements.experience,
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
                                            value={requirements.experience.max}
                                            onChange={(e) =>
                                                setRequirements({
                                                    ...requirements,
                                                    experience: {
                                                        ...requirements.experience,
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
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}>
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
                                            <TableCell>{application.applicant.resume.totalExperience || 0}</TableCell>
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
                                            <TableCell>{dayjs(application.createdAt).format('DD/MM/YYYY')}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() =>
                                                        setRequirements({
                                                            ...requirements,
                                                            rejectedApplications: [
                                                                ...requirements.rejectedApplications,
                                                                application._id,
                                                            ],
                                                        })
                                                    }
                                                >
                                                    Reject
                                                </Button>
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
                                            <TableCell>{application.applicant.resume.totalExperience || 0}</TableCell>
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
                                            <TableCell>{dayjs(application.createdAt).format('DD/MM/YYYY')}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() =>
                                                        setRequirements({
                                                            ...requirements,
                                                            rejectedApplications: [
                                                                ...requirements.rejectedApplications,
                                                                application._id,
                                                            ],
                                                        })
                                                    }
                                                >
                                                    Reject
                                                </Button>
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
                                            <TableCell>{application.applicant.resume.totalExperience || 0}</TableCell>
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
                                            <TableCell>{dayjs(application.createdAt).format('DD/MM/YYYY')}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() =>
                                                        setRequirements({
                                                            ...requirements,
                                                            rejectedApplications: [
                                                                ...requirements.rejectedApplications,
                                                                application._id,
                                                            ],
                                                        })
                                                    }
                                                >
                                                    Reject
                                                </Button>
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
                                            <TableCell>{application.applicant.resume.totalExperience || 0}</TableCell>
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
                                            <TableCell>{dayjs(application.createdAt).format('DD/MM/YYYY')}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() =>
                                                        setRequirements({
                                                            ...requirements,
                                                            rejectedApplications: [
                                                                ...requirements.rejectedApplications.filter(
                                                                    (id) => id !== application._id,
                                                                ),
                                                            ],
                                                        })
                                                    }
                                                >
                                                    Unreject
                                                </Button>
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
                                            <TableCell>{application.applicant.resume.totalExperience || 0}</TableCell>
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
                                            <TableCell>{dayjs(application.createdAt).format('DD/MM/YYYY')}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() =>
                                                        setRequirements({
                                                            ...requirements,
                                                            rejectedApplications: [
                                                                ...requirements.rejectedApplications,
                                                                application._id,
                                                            ],
                                                        })
                                                    }
                                                >
                                                    Reject
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </AccordionDetails>
                    </Accordion>
                </Stack>
            </Grid>
        </Grid>
    );
}
