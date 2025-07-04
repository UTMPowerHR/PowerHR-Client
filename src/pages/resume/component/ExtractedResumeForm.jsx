'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    TextField,
    Typography,
    FormControl,
    Stack,
    IconButton,
    Button,
    Select,
    InputLabel,
    MenuItem,
    Chip,
    Alert,
} from '@mui/material';
import { Add, Remove, Save, Cancel } from '@mui/icons-material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';

const defaultResumeStructure = {
    basicDetail: {
        name: '',
        imageURL: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        websiteUrl: {
            linkedin: '',
            github: '',
            portfolio: '',
        },
    },
    objective: {
        name: 'Objective',
        value: [''],
    },
    summary: {
        name: 'Summary',
        value: [''],
    },
    education: {
        name: 'Education',
        value: [
            {
                institution: '',
                degree: '',
                date: { from: '', to: '' },
                description: [''],
            },
        ],
    },
    experience: {
        name: 'Experience',
        value: [
            {
                company: '',
                location: '',
                title: '',
                date: { from: '', to: '' },
                description: [''],
            },
        ],
    },
    awards: {
        name: 'Awards',
        value: [
            {
                name: '',
                from: '',
                date: '',
                description: [''],
            },
        ],
    },
    languages: {
        name: 'Languages',
        value: [
            {
                name: '',
                level: '',
            },
        ],
    },
    technicalSkills: {
        name: 'Technical Skills',
        value: [
            {
                name: '',
                level: '',
            },
        ],
    },
    softSkills: {
        name: 'Soft Skills',
        value: [
            {
                name: '',
                level: '',
            },
        ],
    },
    voluntering: {
        name: 'Voluntering',
        value: [
            {
                name: '',
                date: { from: '', to: '' },
                description: [''],
            },
        ],
    },
    references: {
        name: 'References',
        value: [
            {
                name: '',
                company: '',
                phone: '',
                email: '',
            },
        ],
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

export default function ExtractedResumeForm({ initialData, onSave, onCancel, isLoading }) {
    const [formData, setFormData] = useState(defaultResumeStructure);
    const [missingFields, setMissingFields] = useState([]);

    useEffect(() => {
        if (initialData) {
            console.log('Processing initial data:', initialData);

            // Deep merge the extracted data with default structure
            const mergedData = { ...defaultResumeStructure };

            // Merge basic details
            if (initialData.basicDetail) {
                mergedData.basicDetail = { ...mergedData.basicDetail, ...initialData.basicDetail };
            }

            // Handle objective and summary - convert string to array if needed
            if (initialData.objective) {
                mergedData.objective = {
                    name: 'Objective',
                    value:
                        typeof initialData.objective.value === 'string'
                            ? [initialData.objective.value]
                            : initialData.objective.value || [''],
                };
            }

            if (initialData.summary) {
                mergedData.summary = {
                    name: 'Summary',
                    value:
                        typeof initialData.summary.value === 'string'
                            ? [initialData.summary.value]
                            : initialData.summary.value || [''],
                };
            }
            // Merge other sections
            [
                'education',
                'experience',
                'awards',
                'languages',
                'technicalSkills',
                'softSkills',
                'voluntering',
                'references',
            ].forEach((section) => {
                if (initialData[section] && initialData[section].value && initialData[section].value.length > 0) {
                    mergedData[section] = {
                        name: mergedData[section].name,
                        value: initialData[section].value,
                    };
                }
            });

            // Ensure template structure
            if (initialData.template) {
                mergedData.template = { ...mergedData.template, ...initialData.template };
            }

            console.log('Merged data:', mergedData);
            setFormData(mergedData);
            identifyMissingFields(mergedData);
        }
    }, [initialData]);

    const identifyMissingFields = (data) => {
        const missing = [];

        // Check basic details
        if (!data.basicDetail.name) missing.push('Name');
        if (!data.basicDetail.email) missing.push('Email');
        if (!data.basicDetail.phone) missing.push('Phone');

        // Check if sections are empty
        if (!data.objective.value[0]) missing.push('Objective');
        if (!data.summary.value[0]) missing.push('Summary');
        if (!data.education.value[0]?.institution) missing.push('Education');
        if (!data.experience.value[0]?.company) missing.push('Experience');
        // if (!data.awards.value[0]?.name) missing.push('Awards');
        if (!data.languages.value[0]?.name) missing.push('Languages');
        if (!data.technicalSkills.value[0]?.name) missing.push('Technical Skills');
        if (!data.softSkills.value[0]?.name) missing.push('Soft Skills');
        // if (!data.voluntering.value[0]?.name) missing.push('Voluntering');
        // if (!data.references.value[0]?.name) missing.push('References');

        setMissingFields(missing);
    };

    const handleSave = () => {
        onSave(formData);
    };

    const updateFormData = (newData) => {
        setFormData(newData);
        identifyMissingFields(newData);
    };

    const addArrayItem = (section, newItem) => {
        updateFormData({
            ...formData,
            [section]: {
                ...formData[section],
                value: [...formData[section].value, newItem],
            },
        });
    };

    const removeArrayItem = (section, index) => {
        updateFormData({
            ...formData,
            [section]: {
                ...formData[section],
                value: formData[section].value.filter((_, i) => i !== index),
            },
        });
    };

    const updateArrayItem = (section, index, updatedItem) => {
        updateFormData({
            ...formData,
            [section]: {
                ...formData[section],
                value: formData[section].value.map((item, i) => (i === index ? updatedItem : item)),
            },
        });
    };

    return (
        <Box>
            {missingFields.length > 0 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Missing or incomplete information:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {missingFields.map((field) => (
                            <Chip key={field} label={field} size="small" color="warning" />
                        ))}
                    </Box>
                </Alert>
            )}

            <Stack spacing={2}>
                {/* Basic Details */}
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">Basic Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack spacing={2}>
                            <TextField
                                label="Full Name"
                                value={formData.basicDetail.name}
                                onChange={(e) =>
                                    updateFormData({
                                        ...formData,
                                        basicDetail: { ...formData.basicDetail, name: e.target.value },
                                    })
                                }
                                required
                                error={!formData.basicDetail.name}
                                helperText={!formData.basicDetail.name ? 'Name is required' : ''}
                            />
                            <TextField
                                label="Professional Title"
                                value={formData.basicDetail.title}
                                onChange={(e) =>
                                    updateFormData({
                                        ...formData,
                                        basicDetail: { ...formData.basicDetail, title: e.target.value },
                                    })
                                }
                            />
                            <TextField
                                label="Email"
                                type="email"
                                value={formData.basicDetail.email}
                                onChange={(e) =>
                                    updateFormData({
                                        ...formData,
                                        basicDetail: { ...formData.basicDetail, email: e.target.value },
                                    })
                                }
                                required
                                error={!formData.basicDetail.email}
                            />
                            <TextField
                                label="Phone"
                                value={formData.basicDetail.phone}
                                onChange={(e) =>
                                    updateFormData({
                                        ...formData,
                                        basicDetail: { ...formData.basicDetail, phone: e.target.value },
                                    })
                                }
                                required
                                error={!formData.basicDetail.phone}
                            />
                            <TextField
                                label="Location"
                                value={formData.basicDetail.location}
                                onChange={(e) =>
                                    updateFormData({
                                        ...formData,
                                        basicDetail: { ...formData.basicDetail, location: e.target.value },
                                    })
                                }
                            />
                            <TextField
                                label="LinkedIn URL"
                                value={formData.basicDetail.websiteUrl.linkedin}
                                onChange={(e) =>
                                    updateFormData({
                                        ...formData,
                                        basicDetail: {
                                            ...formData.basicDetail,
                                            websiteUrl: {
                                                ...formData.basicDetail.websiteUrl,
                                                linkedin: e.target.value,
                                            },
                                        },
                                    })
                                }
                            />
                            <TextField
                                label="Portfolio URL"
                                value={formData.basicDetail.websiteUrl.portfolio}
                                onChange={(e) =>
                                    updateFormData({
                                        ...formData,
                                        basicDetail: {
                                            ...formData.basicDetail,
                                            websiteUrl: {
                                                ...formData.basicDetail.websiteUrl,
                                                portfolio: e.target.value,
                                            },
                                        },
                                    })
                                }
                            />
                        </Stack>
                    </AccordionDetails>
                </Accordion>

                {/* Objective */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">Objective</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack spacing={2}>
                            <TextField
                                label="Objective"
                                value={
                                    Array.isArray(formData.objective.value)
                                        ? formData.objective.value[0] || ''
                                        : formData.objective.value || ''
                                }
                                onChange={(e) =>
                                    updateFormData({
                                        ...formData,
                                        objective: {
                                            name: 'Objective',
                                            value: [e.target.value],
                                        },
                                    })
                                }
                                multiline
                                rows={3}
                                fullWidth
                                placeholder="Enter your career objective here..."
                            />
                        </Stack>
                    </AccordionDetails>
                </Accordion>

                {/* Summary */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">Summary</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack spacing={2}>
                            <TextField
                                label="Summary"
                                value={
                                    Array.isArray(formData.summary.value)
                                        ? formData.summary.value[0] || ''
                                        : formData.summary.value || ''
                                }
                                onChange={(e) =>
                                    updateFormData({
                                        ...formData,
                                        summary: {
                                            name: 'Summary',
                                            value: [e.target.value],
                                        },
                                    })
                                }
                                multiline
                                rows={4}
                                fullWidth
                                placeholder="Enter your professional summary here..."
                            />
                        </Stack>
                    </AccordionDetails>
                </Accordion>

                {/* Experience */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">Work Experience</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack spacing={2}>
                            {formData.experience.value.map((exp, index) => (
                                <Paper key={index} sx={{ p: 2 }} variant="outlined">
                                    <Stack spacing={2}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="subtitle1">Experience {index + 1}</Typography>
                                            {formData.experience.value.length > 1 && (
                                                <IconButton
                                                    onClick={() => removeArrayItem('experience', index)}
                                                    color="error"
                                                    size="small"
                                                >
                                                    <Remove />
                                                </IconButton>
                                            )}
                                        </Stack>
                                        <TextField
                                            label="Company"
                                            value={exp.company}
                                            onChange={(e) =>
                                                updateArrayItem('experience', index, {
                                                    ...exp,
                                                    company: e.target.value,
                                                })
                                            }
                                        />
                                        <TextField
                                            label="Job Title"
                                            value={exp.title}
                                            onChange={(e) =>
                                                updateArrayItem('experience', index, { ...exp, title: e.target.value })
                                            }
                                        />
                                        <TextField
                                            label="Location"
                                            value={exp.location}
                                            onChange={(e) =>
                                                updateArrayItem('experience', index, {
                                                    ...exp,
                                                    location: e.target.value,
                                                })
                                            }
                                        />
                                        <Stack direction="row" spacing={2}>
                                            <TextField
                                                label="Start Date"
                                                value={exp.date.from}
                                                onChange={(e) =>
                                                    updateArrayItem('experience', index, {
                                                        ...exp,
                                                        date: { ...exp.date, from: e.target.value },
                                                    })
                                                }
                                                fullWidth
                                            />
                                            <TextField
                                                label="End Date"
                                                value={exp.date.to}
                                                onChange={(e) =>
                                                    updateArrayItem('experience', index, {
                                                        ...exp,
                                                        date: { ...exp.date, to: e.target.value },
                                                    })
                                                }
                                                fullWidth
                                            />
                                        </Stack>
                                        {exp.description.map((desc, descIndex) => (
                                            <Stack key={descIndex} direction="row" spacing={1} alignItems="center">
                                                <TextField
                                                    label={`Description ${descIndex + 1}`}
                                                    value={desc}
                                                    onChange={(e) => {
                                                        const newDescriptions = [...exp.description];
                                                        newDescriptions[descIndex] = e.target.value;
                                                        updateArrayItem('experience', index, {
                                                            ...exp,
                                                            description: newDescriptions,
                                                        });
                                                    }}
                                                    multiline
                                                    rows={2}
                                                    fullWidth
                                                />
                                                {exp.description.length > 1 && (
                                                    <IconButton
                                                        onClick={() => {
                                                            const newDescriptions = exp.description.filter(
                                                                (_, i) => i !== descIndex,
                                                            );
                                                            updateArrayItem('experience', index, {
                                                                ...exp,
                                                                description: newDescriptions,
                                                            });
                                                        }}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        <Remove />
                                                    </IconButton>
                                                )}
                                            </Stack>
                                        ))}
                                        <Button
                                            startIcon={<Add />}
                                            onClick={() => {
                                                const newDescriptions = [...exp.description, ''];
                                                updateArrayItem('experience', index, {
                                                    ...exp,
                                                    description: newDescriptions,
                                                });
                                            }}
                                            size="small"
                                        >
                                            Add Description
                                        </Button>
                                    </Stack>
                                </Paper>
                            ))}
                            <Button
                                startIcon={<Add />}
                                onClick={() =>
                                    addArrayItem('experience', {
                                        company: '',
                                        location: '',
                                        title: '',
                                        date: { from: '', to: '' },
                                        description: [''],
                                    })
                                }
                                variant="outlined"
                            >
                                Add Experience
                            </Button>
                        </Stack>
                    </AccordionDetails>
                </Accordion>

                {/* Education */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">Education</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack spacing={2}>
                            {formData.education.value.map((edu, index) => (
                                <Paper key={index} sx={{ p: 2 }} variant="outlined">
                                    <Stack spacing={2}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="subtitle1">Education {index + 1}</Typography>
                                            {formData.education.value.length > 1 && (
                                                <IconButton
                                                    onClick={() => removeArrayItem('education', index)}
                                                    color="error"
                                                    size="small"
                                                >
                                                    <Remove />
                                                </IconButton>
                                            )}
                                        </Stack>
                                        <TextField
                                            label="Institution"
                                            value={edu.institution}
                                            onChange={(e) =>
                                                updateArrayItem('education', index, {
                                                    ...edu,
                                                    institution: e.target.value,
                                                })
                                            }
                                        />
                                        <TextField
                                            label="Degree"
                                            value={edu.degree}
                                            onChange={(e) =>
                                                updateArrayItem('education', index, { ...edu, degree: e.target.value })
                                            }
                                        />
                                        <Stack direction="row" spacing={2}>
                                            <TextField
                                                label="Start Date"
                                                value={edu.date.from}
                                                onChange={(e) =>
                                                    updateArrayItem('education', index, {
                                                        ...edu,
                                                        date: { ...edu.date, from: e.target.value },
                                                    })
                                                }
                                                fullWidth
                                            />
                                            <TextField
                                                label="End Date"
                                                value={edu.date.to}
                                                onChange={(e) =>
                                                    updateArrayItem('education', index, {
                                                        ...edu,
                                                        date: { ...edu.date, to: e.target.value },
                                                    })
                                                }
                                                fullWidth
                                            />
                                        </Stack>
                                    </Stack>
                                </Paper>
                            ))}
                            <Button
                                startIcon={<Add />}
                                onClick={() =>
                                    addArrayItem('education', {
                                        institution: '',
                                        degree: '',
                                        date: { from: '', to: '' },
                                        description: [''],
                                    })
                                }
                                variant="outlined"
                            >
                                Add Education
                            </Button>
                        </Stack>
                    </AccordionDetails>
                </Accordion>

                {/* Skills */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">Skills</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack spacing={3}>
                            {/* Technical Skills */}
                            <Box>
                                <Typography variant="subtitle1" gutterBottom>
                                    Technical Skills
                                </Typography>
                                <Stack spacing={2}>
                                    {formData.technicalSkills.value.map((skill, index) => (
                                        <Stack key={index} direction="row" spacing={2} alignItems="center">
                                            <TextField
                                                label="Skill"
                                                value={skill.name}
                                                onChange={(e) =>
                                                    updateArrayItem('technicalSkills', index, {
                                                        ...skill,
                                                        name: e.target.value,
                                                    })
                                                }
                                                fullWidth
                                            />
                                            <FormControl sx={{ minWidth: 150 }}>
                                                <InputLabel>Level</InputLabel>
                                                <Select
                                                    value={skill.level}
                                                    label="Level"
                                                    onChange={(e) =>
                                                        updateArrayItem('technicalSkills', index, {
                                                            ...skill,
                                                            level: e.target.value,
                                                        })
                                                    }
                                                >
                                                    <MenuItem value="Fundamental">Fundamental</MenuItem>
                                                    <MenuItem value="Novice">Novice</MenuItem>
                                                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                                                    <MenuItem value="Advanced">Advanced</MenuItem>
                                                    <MenuItem value="Expert">Expert</MenuItem>
                                                </Select>
                                            </FormControl>
                                            {formData.technicalSkills.value.length > 1 && (
                                                <IconButton
                                                    onClick={() => removeArrayItem('technicalSkills', index)}
                                                    color="error"
                                                >
                                                    <Remove />
                                                </IconButton>
                                            )}
                                        </Stack>
                                    ))}
                                    <Button
                                        startIcon={<Add />}
                                        onClick={() => addArrayItem('technicalSkills', { name: '', level: '' })}
                                        size="small"
                                    >
                                        Add Technical Skill
                                    </Button>
                                </Stack>
                            </Box>

                            {/* Soft Skills */}
                            <Box>
                                <Typography variant="subtitle1" gutterBottom>
                                    Soft Skills
                                </Typography>
                                <Stack spacing={2}>
                                    {formData.softSkills.value.map((skill, index) => (
                                        <Stack key={index} direction="row" spacing={2} alignItems="center">
                                            <TextField
                                                label="Soft Skill"
                                                value={skill.name}
                                                onChange={(e) =>
                                                    updateArrayItem('softSkills', index, {
                                                        ...skill,
                                                        name: e.target.value,
                                                    })
                                                }
                                                fullWidth
                                            />
                                            {formData.softSkills.value.length > 1 && (
                                                <IconButton
                                                    onClick={() => removeArrayItem('softSkills', index)}
                                                    color="error"
                                                >
                                                    <Remove />
                                                </IconButton>
                                            )}
                                        </Stack>
                                    ))}
                                    <Button
                                        startIcon={<Add />}
                                        onClick={() => addArrayItem('softSkills', { name: '' })}
                                        size="small"
                                    >
                                        Add Soft Skill
                                    </Button>
                                </Stack>
                            </Box>
                        </Stack>
                    </AccordionDetails>
                </Accordion>

                {/* Languages */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">Languages</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack spacing={2}>
                            {formData.languages.value.map((language, index) => (
                                <Stack key={index} direction="row" spacing={2} alignItems="center">
                                    <TextField
                                        label="Language"
                                        value={language.name}
                                        onChange={(e) =>
                                            updateArrayItem('languages', index, {
                                                ...language,
                                                name: e.target.value,
                                            })
                                        }
                                        fullWidth
                                    />
                                    <FormControl sx={{ minWidth: 150 }}>
                                        <InputLabel>Proficiency</InputLabel>
                                        <Select
                                            value={language.level}
                                            label="Proficiency"
                                            onChange={(e) =>
                                                updateArrayItem('languages', index, {
                                                    ...language,
                                                    level: e.target.value,
                                                })
                                            }
                                        >
                                            <MenuItem value="Beginner">Beginner</MenuItem>
                                            <MenuItem value="Elementary">Elementary</MenuItem>
                                            <MenuItem value="Intermediate">Intermediate</MenuItem>
                                            <MenuItem value="Upper Intermediate">Upper Intermediate</MenuItem>
                                            <MenuItem value="Advanced">Advanced</MenuItem>
                                            <MenuItem value="Proficient">Proficient</MenuItem>
                                            <MenuItem value="Native">Native</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {formData.languages.value.length > 1 && (
                                        <IconButton onClick={() => removeArrayItem('languages', index)} color="error">
                                            <Remove />
                                        </IconButton>
                                    )}
                                </Stack>
                            ))}
                            <Button
                                startIcon={<Add />}
                                onClick={() => addArrayItem('languages', { name: '', level: '' })}
                                size="small"
                            >
                                Add Language
                            </Button>
                        </Stack>
                    </AccordionDetails>
                </Accordion>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                    <Button variant="outlined" onClick={onCancel} startIcon={<Cancel />} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSave} startIcon={<Save />} disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save & Continue'}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}

ExtractedResumeForm.propTypes = {
    initialData: PropTypes.shape({
        basicDetail: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            phone: PropTypes.string,
            websiteUrl: PropTypes.shape({
                linkedin: PropTypes.string,
                portfolio: PropTypes.string,
            }),
        }),
        objective: PropTypes.shape({
            value: PropTypes.arrayOf(PropTypes.string),
        }),
        summary: PropTypes.shape({
            value: PropTypes.arrayOf(PropTypes.string),
        }),
        education: PropTypes.shape({
            value: PropTypes.arrayOf(
                PropTypes.shape({
                    institution: PropTypes.string,
                    degree: PropTypes.string,
                    date: PropTypes.shape({
                        from: PropTypes.string,
                        to: PropTypes.string,
                    }),
                    description: PropTypes.arrayOf(PropTypes.string),
                }),
            ),
        }),
        experience: PropTypes.shape({
            value: PropTypes.arrayOf(
                PropTypes.shape({
                    company: PropTypes.string,
                    location: PropTypes.string,
                    title: PropTypes.string,
                    date: PropTypes.shape({
                        from: PropTypes.string,
                        to: PropTypes.string,
                    }),
                    description: PropTypes.arrayOf(PropTypes.string),
                }),
            ),
        }),
        awards: PropTypes.shape({
            value: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string,
                    from: PropTypes.string,
                    date: PropTypes.string,
                    description: PropTypes.arrayOf(PropTypes.string),
                }),
            ),
        }),
        languages: PropTypes.shape({
            value: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string,
                    level: PropTypes.string,
                }),
            ),
        }),
        technicalSkills: PropTypes.shape({
            value: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string,
                    level: PropTypes.string,
                }),
            ),
        }),
        softSkills: PropTypes.shape({
            value: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string,
                }),
            ),
        }),
        voluntering: PropTypes.shape({
            value: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string,
                    date: PropTypes.shape({
                        from: PropTypes.string,
                        to: PropTypes.string,
                    }),
                    description: PropTypes.arrayOf(PropTypes.string),
                }),
            ),
        }),
        template: PropTypes.string,
    }),
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
};

ExtractedResumeForm.defaultProps = {
    initialData: {},
};
