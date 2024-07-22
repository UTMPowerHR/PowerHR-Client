import { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    Paper,
    Box,
    Select,
    MenuItem,
    FormControl,
    FormLabel,
    FormGroup,
    Checkbox,
    InputLabel,
    Button,
    Menu,
    Typography,
    Slider,
    Table,
    TableRow,
    TableBody,
    TableHead,
    TableCell,
    TextField,
    Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useGetApplicationsByCompanyIdQuery } from '../../features/application/applicationApiSlice';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

export default function Filter() {
    const companyId = useSelector((state) => state.auth.user.company);
    const [savedData, setSavedData] = useState([]);
    const [selectedJobTitle, setSelectedJobTitle] = useState('');
    const [selectedEducation, setSelectedEducation] = useState('');
    const [selectedMinExperience, setMinExperience] = useState(0);
    const [selectedMaxExperience, setMaxExperience] = useState(12);
    const [suggestedData, setSuggestedData] = useState([]);
    const [underqualifiedData, setUnderqualifiedData] = useState([]);
    const [overqualifiedData, setOverqualifiedData] = useState([]);
    const [probableCandidateData, setProbableCandidateData] = useState([]);
    const [rejectedData, setRejectedData] = useState([]);
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);

    const getYearOptions = () => {
        if (!selectedJobTitle) {
            return []; // Return an empty array if no job title is selected
        }
        // Filter savedData to get year options based on selectedJobTitle
        const yearOptions = savedData
            .filter((item) => item.jobTitle === selectedJobTitle)
            .map((item) => item.createdAt.year);

        // Return unique year options
        return [...new Set(yearOptions)];
    };

    const getMonthOptions = () => {
        if (!selectedJobTitle) {
            return []; // Return an empty array if no job title is selected
        }
        // Filter savedData to get month options based on selectedJobTitle
        const monthOptions = savedData
            .filter((item) => item.jobTitle === selectedJobTitle)
            .map((item) => item.createdAt.month);

        // Return unique month options
        return [...new Set(monthOptions)];
    };

    const isQualified = (applicantQualification, jobQualification) => {
        const qualificationOrder = ['SPM', 'Diploma', 'Degree', 'Master', 'PhD'];

        const applicantIndex = qualificationOrder.indexOf(applicantQualification);
        const jobIndex = qualificationOrder.indexOf(jobQualification);

        return {
            underQualified: applicantIndex < jobIndex,
            overQualified: applicantIndex > jobIndex,
        };
    };

    // Function to handle language checkbox change
    const handleLanguageCheckboxChange = (language) => (event) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            setSelectedLanguage([...selectedLanguage, language]);
        } else {
            setSelectedLanguage(selectedLanguage.filter((lang) => lang !== language));
        }
    };

    // Function to handle skills checkbox change
    const handleSkillsCheckboxChange = (skill) => (event) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            setSelectedSkills([...selectedSkills, skill]);
        } else {
            setSelectedSkills(selectedSkills.filter((skills) => skills !== skill));
        }
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl2, setAnchorEl2] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClick2 = (event) => {
        // Get the button's position
        setAnchorEl2(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClose2 = () => {
        setAnchorEl2(null);
    };

    const handleCheckboxChange = (applicant) => (event) => {
        const isChecked = event.target.checked;

        const removeFromCategory = (category, data) => {
            return data.filter((selectedApplicant) => selectedApplicant !== applicant);
        };

        let updatedSuggestedData = [...suggestedData];
        let updatedUnderqualifiedData = [...underqualifiedData];
        let updatedOverqualifiedData = [...overqualifiedData];
        let updatedRejectedData = [...rejectedData];

        if (isChecked) {
            updatedRejectedData = [...updatedRejectedData, applicant];
            updatedSuggestedData = removeFromCategory('suggested', updatedSuggestedData);
            updatedUnderqualifiedData = removeFromCategory('underqualified', updatedUnderqualifiedData);
            updatedOverqualifiedData = removeFromCategory('overqualified', updatedOverqualifiedData);
        } else {
            updatedRejectedData = updatedRejectedData.filter((rejected) => rejected !== applicant);

            if (isInArray(applicant, updatedSuggestedData)) {
                updatedSuggestedData = removeFromCategory('suggested', updatedSuggestedData);
            } else if (isInArray(applicant, updatedUnderqualifiedData)) {
                updatedUnderqualifiedData = removeFromCategory('underqualified', updatedUnderqualifiedData);
            } else if (isInArray(applicant, updatedOverqualifiedData)) {
                updatedOverqualifiedData = removeFromCategory('overqualified', updatedOverqualifiedData);
            }
        }

        setSuggestedData(updatedSuggestedData);
        setUnderqualifiedData(updatedUnderqualifiedData);
        setOverqualifiedData(updatedOverqualifiedData);
        setRejectedData(updatedRejectedData);
    };

    const isInArray = (applicant, dataArray) => {
        return dataArray.some((selectedApplicant) => selectedApplicant === applicant);
    };

    const handleMinExperienceChange = (event) => {
        const value = event.target.value === '' ? '' : Number(event.target.value);
        setMinExperience(value >= 0 ? Math.min(value, selectedMaxExperience) : 0);
    };

    const handleMaxExperienceChange = (event) => {
        const value = event.target.value === '' ? '' : Number(event.target.value);
        setMaxExperience(value <= 12 ? Math.max(value, selectedMinExperience) : 12);
    };

    const handleSliderChange = (_, newValue) => {
        setMinExperience(newValue[0]);
        setMaxExperience(newValue[1]);
    };

    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const [filterOptions, setFilterOptions] = useState({
        jobTitles: [],
        qualification: [],
        postGender: [],
        desiredLanguages: [],
        desiredSkills: [],
    });

    const { data } = useGetApplicationsByCompanyIdQuery({ companyId, status: 'New' });

    useEffect(() => {
        if (data?.applications) {
            const temp = [];
            data.applications.forEach((application) => {
                application.applications.forEach((app) => {
                    const createdAt = {
                        year: dayjs(application.posting.createdAt).year().toString(),
                        month: monthNames[dayjs(application.posting.createdAt).month().toString()],
                    };

                    const languageInfo = app.applicant.resume.languages.value || [];
                    const languages = Array.isArray(languageInfo) ? languageInfo.map((language) => language.name) : [];

                    const educationInfo = app.applicant.resume.education.value || [];
                    // Extracting course information
                    let education = [];
                    if (Array.isArray(educationInfo)) {
                        education = educationInfo.map((education) => {
                            return education.degree;
                        });
                    } else {
                        return null;
                    }

                    const postGender = ['All', 'Male', 'Female'];

                    const gender = application.posting.gender;

                    const appGender = app.applicant.gender;

                    const desiredLanguages = ['English', 'Malay', 'Mandarin', 'Tamil'];

                    const techSkillsInfo = app.applicant.resume.technicalSkills.value || [];

                    const techSkills = Array.isArray(techSkillsInfo) ? techSkillsInfo.map((skill) => skill.name) : [];

                    const desiredSkills = ['Java', 'Python', 'HTML/CSS', 'JavaScript', 'SQL', 'MongoDB', 'AutoCAD'];

                    const jobExperiences = app.applicant.resume.experience.value || [];
                    let yearsOfExperience = 0; // Default value
                    // Get yearsOfExperience from jobExperiences if available
                    if (jobExperiences.length > 0) {
                        // Assuming you want the total years of experience from all jobs
                        yearsOfExperience = jobExperiences.reduce((total, job) => {
                            const startDate = dayjs(job.date.from, 'MMMM YYYY');
                            const endDate = job.date.to === 'Present' ? dayjs() : dayjs(job.date.to, 'MMMM YYYY');
                            const duration = endDate.diff(startDate, 'year');
                            return total + duration;
                        }, 0);
                    }

                    const categorizedEducation = Array.isArray(education)
                        ? education.map((course) => {
                              if (course.includes('Bachelor')) {
                                  return 'Degree';
                              } else if (course.includes('Diploma')) {
                                  return 'Diploma';
                              } else if (course.includes('Master')) {
                                  return 'Master';
                              } else if (course.includes('Phd')) {
                                  return 'Phd';
                              } else if (course.includes('SPM')) {
                                  return 'SPM';
                              } else {
                                  return 'None';
                              }
                          })
                        : ['None'];

                    // Find the categorized education for the current applicant
                    const categorizedApplicantEducation = categorizedEducation.find(
                        (category) =>
                            category === 'Degree' ||
                            category === 'Diploma' ||
                            category === 'Master' ||
                            category === 'Phd' ||
                            category === 'SPM' ||
                            category === 'None',
                    );

                    const jobTitle = application.posting.job.title;

                    const qualification = application.posting.qualification;

                    const firstName = app.applicant.firstName;

                    const lastName = app.applicant.lastName;

                    const maxExperience = (application.posting.experience && application.posting.experience.max) || 0;

                    const minExperience = (application.posting.experience && application.posting.experience.min) || 0;

                    temp.push({
                        createdAt,
                        jobTitle,
                        firstName,
                        lastName,
                        qualification,
                        maxExperience,
                        minExperience,
                        yearsOfExperience,
                        gender,
                        postGender,
                        appGender,
                        languages,
                        categorizedApplicantEducation,
                        desiredLanguages,
                        techSkills,
                        desiredSkills,
                        categorizedEducation,
                    });
                });
            });

            setSavedData(temp);

            const uniqueJobTitles = [...new Set(temp.map((item) => item.jobTitle))];
            const uniqueQualification = [...new Set(temp.map((item) => item.qualification))];
            const uniquePostGender = [...new Set(temp.map((item) => item.postGender))];
            const uniqueDesLanguage = [...new Set(temp.map((item) => item.desiredLanguages))];
            const uniqueDesSkills = [...new Set(temp.map((item) => item.desiredSkills))];

            const options = {
                jobTitles: uniqueJobTitles,
                qualification: uniqueQualification,
                postGender: uniquePostGender,
                desiredLanguages: uniqueDesLanguage,
                desiredSkills: uniqueDesSkills,
            };

            setFilterOptions(options);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        if (data) {
            const job = data?.applications.find(
                (application) => application.posting.job.title === selectedJobTitle,
            )?.posting;
            if (job) {
                setMaxExperience(job.experience?.max || 0);
                setMinExperience(job.experience?.min || 0);
                setSelectedEducation(job.qualification || 0);
                setSelectedGender(job.gender);
            }
        }
    }, [selectedJobTitle, data]);

    useEffect(() => {
        if (savedData.length >= 0) {
            let suggestedResults = [];
            let underqualifiedResults = [];
            let overqualifiedResults = [];

            const languageEquivalents = {
                Mandarin: ['Chinese', 'Mandarin'],
                // Add other language equivalents as needed
            };

            savedData.forEach((item) => {
                const meetsUserCriteria =
                    item.jobTitle === selectedJobTitle &&
                    item.categorizedEducation[0] === selectedEducation &&
                    item.createdAt.year === selectedYear &&
                    item.createdAt.month === selectedMonth &&
                    item.yearsOfExperience >= selectedMinExperience &&
                    item.yearsOfExperience <= selectedMaxExperience &&
                    (selectedGender === 'All' || item.appGender === selectedGender);

                const { underQualified, overQualified } = isQualified(
                    item.categorizedApplicantEducation,
                    selectedEducation,
                );
                // Language comparison logic
                const hasAllSelectedLanguages = selectedLanguage.every((lang) =>
                    languageEquivalents[lang]
                        ? languageEquivalents[lang].some((equiv) => item.languages.includes(equiv))
                        : item.languages.includes(lang),
                );
                const hasMoreLanguages = item.languages.length > selectedLanguage.length;

                // Skills comparison logic
                const hasAllSelectedSkills = selectedSkills.every((skill) => item.techSkills.includes(skill));
                const hasMoreSkills = item.techSkills.length > selectedSkills.length;

                if (meetsUserCriteria && hasAllSelectedLanguages && hasAllSelectedSkills) {
                    suggestedResults.push(item);
                } else if (
                    item.jobTitle === selectedJobTitle &&
                    (item.yearsOfExperience <= selectedMinExperience ||
                        !hasAllSelectedLanguages ||
                        !hasAllSelectedSkills ||
                        underQualified)
                ) {
                    underqualifiedResults.push(item);
                } else if (
                    item.jobTitle === selectedJobTitle &&
                    (item.yearsOfExperience >= selectedMaxExperience ||
                        hasMoreLanguages ||
                        hasMoreSkills ||
                        overQualified)
                ) {
                    overqualifiedResults.push(item);
                }
            });
            setSuggestedData(suggestedResults);
            setUnderqualifiedData(underqualifiedResults);
            setOverqualifiedData(overqualifiedResults);
            const categorizedArrays = [suggestedResults, underqualifiedResults, overqualifiedResults];
            const uncheckedCategories = categorizedArrays.filter(
                (category) => category.length === 1 && !rejectedData.includes(category[0]),
            );

            if (uncheckedCategories.length === 1) {
                setProbableCandidateData(uncheckedCategories[0]);
            } else {
                setProbableCandidateData([]);
            }
        }
    }, [
        rejectedData,
        selectedJobTitle,
        selectedEducation,
        selectedMinExperience,
        selectedMaxExperience,
        selectedYear,
        selectedMonth,
        selectedLanguage,
        selectedSkills,
        selectedGender,
        savedData,
    ]);

    // Inside the return statement:
    return (
        <Paper>
            <Grid container spacing={3}>
                <Grid item md={20}>
                    <Paper elevation={5}>
                        <Grid container spacing={3}>
                            <Grid item xs={3}>
                                {/* Dropdown for Job Titles */}
                                <FormControl fullWidth>
                                    <InputLabel id="job-title-label">Select Job Title</InputLabel>
                                    <Select
                                        labelId="job-title-label"
                                        id="job-title-select"
                                        value={selectedJobTitle}
                                        onChange={(e) => setSelectedJobTitle(e.target.value)}
                                    >
                                        {filterOptions.jobTitles?.map((title) => (
                                            <MenuItem key={title} value={title}>
                                                {title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            {selectedJobTitle && (
                                <>
                                    <Grid item xs={3}>
                                        {/* Dropdown for Education */}
                                        <FormControl fullWidth>
                                            <InputLabel id="education-label">Select Education</InputLabel>
                                            <Select
                                                labelId="education-label"
                                                id="education-select"
                                                value={selectedEducation}
                                                onChange={(e) => setSelectedEducation(e.target.value)}
                                            >
                                                {filterOptions.qualification?.map((title) => (
                                                    <MenuItem key={title} value={title}>
                                                        {title}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={3}>
                                        {/* Dropdown for Year */}
                                        <FormControl fullWidth>
                                            <InputLabel id="year-label">Select Year</InputLabel>
                                            <Select
                                                labelId="year-label"
                                                id="year-select"
                                                value={selectedYear}
                                                onChange={(e) => setSelectedYear(e.target.value)}
                                            >
                                                {getYearOptions().map((year) => (
                                                    <MenuItem key={year} value={year}>
                                                        {year}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    {selectedJobTitle && selectedYear && (
                                        <Grid item xs={3}>
                                            {/* Month Dropdown */}
                                            <FormControl fullWidth>
                                                <InputLabel id="month-label">Select Month</InputLabel>
                                                <Select
                                                    labelId="month-label"
                                                    id="month-select"
                                                    value={selectedMonth}
                                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                                >
                                                    {getMonthOptions().map((month) => (
                                                        <MenuItem key={month} value={month}>
                                                            {month}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    )}
                                    <Grid item xs={3}>
                                        {/*Languages Popover*/}
                                        <FormControl>
                                            <FormLabel>Select Languages</FormLabel>
                                            <Button onClick={handleClick2} variant="contained" size="small">
                                                Open Languages
                                            </Button>
                                            <Menu
                                                id="language-menu"
                                                anchorEl={anchorEl2}
                                                open={Boolean(anchorEl2)}
                                                onClose={handleClose2}
                                            >
                                                <FormGroup>
                                                    {filterOptions.desiredLanguages[0]?.map((title) => (
                                                        <MenuItem
                                                            key={title}
                                                            onClick={handleLanguageCheckboxChange(title)}
                                                        >
                                                            <Checkbox checked={selectedLanguage.includes(title)} />
                                                            {title}
                                                        </MenuItem>
                                                    ))}
                                                </FormGroup>
                                            </Menu>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={3}>
                                        {/*Skills Popover*/}
                                        <FormControl>
                                            <FormLabel>Select Skills</FormLabel>
                                            <Button onClick={handleClick} variant="contained" size="small">
                                                Open Skills
                                            </Button>
                                            <Menu
                                                id="skills-menu"
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={handleClose}
                                            >
                                                <FormGroup>
                                                    {filterOptions.desiredSkills[0]?.map((title) => (
                                                        <MenuItem
                                                            key={title}
                                                            onClick={handleSkillsCheckboxChange(title)}
                                                        >
                                                            <Checkbox checked={selectedSkills.includes(title)} />
                                                            {title}
                                                        </MenuItem>
                                                    ))}
                                                </FormGroup>
                                            </Menu>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={3}>
                                        {/* Dropdown for Gender*/}
                                        <FormControl fullWidth>
                                            <InputLabel id="gender-label">Select Gender</InputLabel>
                                            <Select
                                                labelId="gender-label"
                                                id="gender-select"
                                                value={selectedGender}
                                                onChange={(e) => setSelectedGender(e.target.value)}
                                            >
                                                {filterOptions.postGender[0].map((title) => (
                                                    <MenuItem key={title} value={title}>
                                                        {title}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item md={4.5}>
                    {/* Range Slider for Experience */}
                    {selectedJobTitle && (
                        <Paper elevation={5}>
                            <div>
                                <Typography id="experience-slider" gutterBottom>
                                    Experience Range
                                </Typography>
                                <Box sx={{ width: 500 }}>
                                    <Stack direction="row" spacing={5} alignItems="center">
                                        <TextField
                                            label="Min"
                                            value={selectedMinExperience}
                                            onChange={handleMinExperienceChange}
                                            type="number"
                                            inputProps={{ min: 0, max: selectedMaxExperience, step: 1 }}
                                            InputProps={{
                                                style: { textAlign: 'center' },
                                                endAdornment: <Box sx={{ width: '10px' }} />,
                                            }}
                                            size="small"
                                            variant="outlined"
                                        />
                                        <Slider
                                            value={[selectedMinExperience, selectedMaxExperience]}
                                            onChange={handleSliderChange}
                                            min={0}
                                            max={12}
                                            valueLabelDisplay="auto"
                                            aria-labelledby="range-slider"
                                            sx={{ flexGrow: 1 }}
                                        />
                                        <TextField
                                            label="Max"
                                            value={selectedMaxExperience}
                                            onChange={handleMaxExperienceChange}
                                            type="number"
                                            inputProps={{ min: selectedMinExperience, max: 12, step: 1 }}
                                            InputProps={{
                                                style: { textAlign: 'center' },
                                                startAdornment: <Box sx={{ width: '10px' }} />,
                                            }}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Stack>
                                </Box>
                            </div>
                        </Paper>
                    )}
                </Grid>
                {/* Display filtered results in accordions */}
                <Grid item md={12}>
                    <Paper elevation={10}>
                        {/* Suggested Data */}
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">Suggested Results</Typography>
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
                                            <TableCell>Languages</TableCell>
                                            <TableCell>Reject</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {suggestedData.map((item, index) => {
                                            if (!rejectedData.includes(item)) {
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {item.firstName} {item.lastName}
                                                        </TableCell>
                                                        <TableCell>{item.appGender}</TableCell>
                                                        <TableCell>
                                                            {item.categorizedEducation.length > 0
                                                                ? item.categorizedEducation[0]
                                                                : 'None'}
                                                        </TableCell>
                                                        <TableCell>{item.yearsOfExperience}</TableCell>
                                                        <TableCell>
                                                            {item.techSkills.length > 0
                                                                ? item.techSkills.join(', ')
                                                                : 'None'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.languages.length > 0
                                                                ? item.languages.join(', ')
                                                                : 'None'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <input
                                                                type="checkbox"
                                                                onChange={handleCheckboxChange(item)}
                                                                checked={rejectedData.includes(item)}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                            return null;
                                        })}
                                        {suggestedData.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4}>No suggested results.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </AccordionDetails>
                        </Accordion>

                        {/* Underqualified Data */}
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">Underqualified Results</Typography>
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
                                            <TableCell>Languages</TableCell>
                                            <TableCell>Reject</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {underqualifiedData.map((item, index) => {
                                            if (!rejectedData.includes(item)) {
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {item.firstName} {item.lastName}
                                                        </TableCell>
                                                        <TableCell>{item.appGender}</TableCell>
                                                        <TableCell>
                                                            {item.categorizedEducation.length > 0
                                                                ? item.categorizedEducation[0]
                                                                : 'None'}
                                                        </TableCell>
                                                        <TableCell>{item.yearsOfExperience}</TableCell>
                                                        <TableCell>
                                                            {item.techSkills.length > 0
                                                                ? item.techSkills.join(', ')
                                                                : 'None'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.languages.length > 0
                                                                ? item.languages.join(', ')
                                                                : 'None'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <input
                                                                type="checkbox"
                                                                onChange={handleCheckboxChange(item)}
                                                                checked={rejectedData.includes(item)}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                            return null;
                                        })}
                                        {underqualifiedData.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4}>No underqualified results.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </AccordionDetails>
                        </Accordion>

                        {/* Overqualified Data */}
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">Overqualified Results</Typography>
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
                                            <TableCell>Languages</TableCell>
                                            <TableCell>Reject</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {overqualifiedData.map((item, index) => {
                                            if (!rejectedData.includes(item)) {
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {item.firstName} {item.lastName}
                                                        </TableCell>
                                                        <TableCell>{item.appGender}</TableCell>
                                                        <TableCell>
                                                            {item.categorizedEducation.length > 0
                                                                ? item.categorizedEducation[0]
                                                                : 'None'}
                                                        </TableCell>
                                                        <TableCell>{item.yearsOfExperience}</TableCell>
                                                        <TableCell>
                                                            {item.techSkills.length > 0
                                                                ? item.techSkills.join(', ')
                                                                : 'None'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.languages.length > 0
                                                                ? item.languages.join(', ')
                                                                : 'None'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <input
                                                                type="checkbox"
                                                                onChange={handleCheckboxChange(item)}
                                                                checked={rejectedData.includes(item)}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                            return null;
                                        })}
                                        {overqualifiedData.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4}>No overqualified results.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </AccordionDetails>
                        </Accordion>
                        {/*Rejected candidate section*/}
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">Rejected Candidates</Typography>
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
                                            <TableCell>Languages</TableCell>
                                            <TableCell>Reject</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rejectedData.map((item, index) => {
                                            const isRejected = rejectedData.includes(item); // Check if the candidate is not in rejectedData
                                            const isJobTitleMatch = item.jobTitle === selectedJobTitle; // Check if the candidate's job title matches
                                            if (isRejected && isJobTitleMatch) {
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {item.firstName} {item.lastName}
                                                        </TableCell>
                                                        <TableCell>{item.appGender}</TableCell>
                                                        <TableCell>
                                                            {item.categorizedEducation.length > 0
                                                                ? item.categorizedEducation[0]
                                                                : 'None'}
                                                        </TableCell>
                                                        <TableCell>{item.yearsOfExperience}</TableCell>
                                                        <TableCell>
                                                            {item.techSkills.length > 0
                                                                ? item.techSkills.join(', ')
                                                                : 'None'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.languages.length > 0
                                                                ? item.languages.join(', ')
                                                                : 'None'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <input
                                                                type="checkbox"
                                                                onChange={handleCheckboxChange(item)}
                                                                checked={rejectedData.includes(item)}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                        })}
                                        {rejectedData.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5}>No rejected candidates.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </AccordionDetails>
                        </Accordion>
                        {/* Probable Candidate Section */}
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">Probable Candidate</Typography>
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
                                            <TableCell>Languages</TableCell>
                                            <TableCell>Reject</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Array.isArray(probableCandidateData) &&
                                            probableCandidateData.map((item, index) => {
                                                const Unrejected = !rejectedData.includes(item); // Check if the candidate is not in rejectedData
                                                const isJobTitleMatch = item.jobTitle === selectedJobTitle; // Check if the candidate's job title matches

                                                if (Unrejected && isJobTitleMatch) {
                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell>
                                                                {item.firstName} {item.lastName}
                                                            </TableCell>
                                                            <TableCell>{item.appGender}</TableCell>
                                                            <TableCell>
                                                                {item.categorizedEducation.length > 0
                                                                    ? item.categorizedEducation[0]
                                                                    : 'None'}
                                                            </TableCell>
                                                            <TableCell>{item.yearsOfExperience}</TableCell>
                                                            <TableCell>
                                                                {item.techSkills.length > 0
                                                                    ? item.techSkills.join(', ')
                                                                    : 'None'}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.languages.length > 0
                                                                    ? item.languages.join(', ')
                                                                    : 'None'}
                                                            </TableCell>
                                                            <TableCell>
                                                                <input
                                                                    type="checkbox"
                                                                    onChange={handleCheckboxChange(item)}
                                                                    checked={rejectedData.includes(item)}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                }
                                            })}
                                        {probableCandidateData.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5}>No probable candidate.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </AccordionDetails>
                        </Accordion>
                    </Paper>
                </Grid>
            </Grid>
        </Paper>
    );
}
