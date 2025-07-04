import {
    Box,
    Drawer,
    Toolbar,
    TextField,
    Typography,
    FormControl,
    Stack,
    IconButton,
    Button,
    Paper,
    Select,
    InputLabel,
    MenuItem,
} from '@mui/material';
import { setResume } from '../../../features/applicant/applicantSlice';
import { useSelector, useDispatch } from 'react-redux';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
const drawerWidth = 500;
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function FormDrawer() {
    //save
    const dispatch = useDispatch();

    const formData = useSelector((state) => state.applicant.resume);

    //redux state update
    const handleEditData = (data) => {
        dispatch(setResume(data));
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                anchor="right"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        top: '64px',
                        height: 'calc(100vh - 64px)',
                    },
                }}
            >
                <Box sx={{ overflow: 'auto', p: 1 }}>
                    <Stack spacing={2}>
                        {/* Basic Details */}
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="basic-details-content"
                                id="basic-details-header"
                            >
                                <Typography variant="h6">Basic Details </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl fullWidth>
                                    <Stack spacing={2}>
                                        <TextField
                                            label="Name"
                                            variant="outlined"
                                            margin="normal"
                                            value={formData.basicDetail.name}
                                            onChange={(e) =>
                                                handleEditData({
                                                    ...formData, // Spread existing formData properties
                                                    basicDetail: {
                                                        ...formData.basicDetail, // Spread existing basicDetail properties
                                                        name: e.target.value, // Update the name property
                                                    },
                                                })
                                            }
                                        />

                                        <TextField
                                            label="Image URL"
                                            variant="outlined"
                                            margin="normal"
                                            value={formData.basicDetail.imageURL}
                                            onChange={(e) =>
                                                handleEditData({
                                                    ...formData,
                                                    basicDetail: {
                                                        ...formData.basicDetail,
                                                        imageURL: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                        <TextField
                                            label="Title"
                                            variant="outlined"
                                            margin="normal"
                                            value={formData.basicDetail.title}
                                            onChange={(e) =>
                                                handleEditData({
                                                    ...formData,
                                                    basicDetail: {
                                                        ...formData.basicDetail,
                                                        title: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                        <TextField
                                            label="Email"
                                            variant="outlined"
                                            margin="normal"
                                            value={formData.basicDetail.email}
                                            onChange={(e) =>
                                                handleEditData({
                                                    ...formData,
                                                    basicDetail: {
                                                        ...formData.basicDetail,
                                                        email: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                        <TextField
                                            label="linkedin"
                                            variant="outlined"
                                            margin="normal"
                                            value={formData.basicDetail.websiteUrl.linkedin}
                                            onChange={(e) =>
                                                handleEditData({
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
                                            label="Website Url"
                                            variant="outlined"
                                            margin="normal"
                                            value={formData.basicDetail.websiteUrl.portfolio}
                                            onChange={(e) =>
                                                handleEditData({
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
                                        <TextField
                                            label="Phone Number"
                                            variant="outlined"
                                            margin="normal"
                                            value={formData.basicDetail.phone}
                                            onChange={(e) =>
                                                handleEditData({
                                                    ...formData,
                                                    basicDetail: {
                                                        ...formData.basicDetail,
                                                        phone: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                        <TextField
                                            label="Location"
                                            variant="outlined"
                                            margin="normal"
                                            value={formData.basicDetail.location}
                                            onChange={(e) =>
                                                handleEditData({
                                                    ...formData,
                                                    basicDetail: {
                                                        ...formData.basicDetail,
                                                        location: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </Stack>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>

                        {/* Objectives */}
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="objectives-content"
                                id="objectives-header"
                            >
                                <Typography variant="h6">Objectives</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl fullWidth>
                                    {Array.isArray(formData.objective.value) &&
                                        formData.objective.value.map((objectiveEntry, index) => (
                                            <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    mb={2}
                                                >
                                                    <Typography variant="h6">Objective {index + 1}</Typography>
                                                    {formData.objective.value.length > 1 && (
                                                        <IconButton
                                                            onClick={() =>
                                                                handleEditData({
                                                                    ...formData,
                                                                    objective: {
                                                                        ...formData.objective,
                                                                        value: formData.objective.value.filter(
                                                                            (item, i) => i !== index,
                                                                        ),
                                                                    },
                                                                })
                                                            }
                                                            size="small"
                                                            color="error"
                                                        >
                                                            <RemoveCircleIcon />
                                                        </IconButton>
                                                    )}
                                                </Stack>

                                                <Stack spacing={2}>
                                                    <TextField
                                                        label="Objective"
                                                        variant="outlined"
                                                        margin="normal"
                                                        value={objectiveEntry || ''}
                                                        onChange={(e) =>
                                                            handleEditData({
                                                                ...formData,
                                                                objective: {
                                                                    ...formData.objective,
                                                                    value: formData.objective.value.map((item, i) =>
                                                                        i === index ? e.target.value : item,
                                                                    ),
                                                                },
                                                            })
                                                        }
                                                        fullWidth
                                                        multiline
                                                    />
                                                </Stack>
                                            </Paper>
                                        ))}
                                    <Box pl={formData.objective.value.length > 0 ? 6 : 0}>
                                        <Button
                                            variant="text"
                                            onClick={() =>
                                                handleEditData({
                                                    ...formData,
                                                    objective: {
                                                        ...formData.objective,
                                                        value: [...formData.objective.value, ''],
                                                    },
                                                })
                                            }
                                            size="small"
                                        >
                                            Add Objective
                                        </Button>
                                    </Box>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>

                        {/* Summary */}
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="summary-content"
                                id="summary-header"
                            >
                                <Typography variant="h6">Summary</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl fullWidth>
                                    {Array.isArray(formData.summary.value) &&
                                        formData.summary.value.map((summaryEntry, index) => (
                                            <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    mb={2}
                                                >
                                                    <Typography variant="h6">Summary {index + 1}</Typography>
                                                    {formData.summary.value.length > 1 && (
                                                        <IconButton
                                                            onClick={() =>
                                                                handleEditData({
                                                                    ...formData,
                                                                    summary: {
                                                                        ...formData.summary,
                                                                        value: formData.summary.value.filter(
                                                                            (item, i) => i !== index,
                                                                        ),
                                                                    },
                                                                })
                                                            }
                                                            size="small"
                                                            color="error"
                                                        >
                                                            <RemoveCircleIcon />
                                                        </IconButton>
                                                    )}
                                                </Stack>

                                                <Stack spacing={2}>
                                                    <TextField
                                                        label="Summary"
                                                        variant="outlined"
                                                        margin="normal"
                                                        value={summaryEntry || ''}
                                                        onChange={(e) =>
                                                            handleEditData({
                                                                ...formData,
                                                                summary: {
                                                                    ...formData.summary,
                                                                    value: formData.summary.value.map((item, i) =>
                                                                        i === index ? e.target.value : item,
                                                                    ),
                                                                },
                                                            })
                                                        }
                                                        fullWidth
                                                        multiline
                                                    />
                                                </Stack>
                                            </Paper>
                                        ))}
                                    <Box pl={formData.summary.value.length > 0 ? 6 : 0}>
                                        <Button
                                            margin="left"
                                            variant="text"
                                            onClick={() =>
                                                handleEditData({
                                                    ...formData,
                                                    summary: {
                                                        ...formData.summary,
                                                        value: [...formData.summary.value, ''],
                                                    },
                                                })
                                            }
                                            size="small"
                                        >
                                            Add Summary
                                        </Button>
                                    </Box>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>

                        {/* Education */}
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="education-content"
                                id="education-header"
                            >
                                <Typography variant="h6">Education</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl fullWidth>
                                    {Array.isArray(formData.education.value) &&
                                        formData.education.value.map((educationEntry, index) => (
                                            <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    mb={2}
                                                >
                                                    <Typography variant="h6">Education {index + 1}</Typography>
                                                    {educationEntry.description.length > 1 && (
                                                        <IconButton
                                                            onClick={() =>
                                                                handleEditData({
                                                                    ...formData,
                                                                    education: {
                                                                        ...formData.education,
                                                                        value: formData.education.value.filter(
                                                                            (item, i) => i !== index,
                                                                        ),
                                                                    },
                                                                })
                                                            }
                                                            size="small"
                                                            color="error"
                                                        >
                                                            <RemoveCircleIcon />
                                                        </IconButton>
                                                    )}
                                                </Stack>

                                                <Stack spacing={2} alignItems="stretch">
                                                    <TextField
                                                        label="Institution"
                                                        variant="outlined"
                                                        margin="normal"
                                                        value={educationEntry.institution || ''}
                                                        onChange={(e) =>
                                                            handleEditData({
                                                                ...formData,
                                                                education: {
                                                                    ...formData.education,
                                                                    value: formData.education.value.map((item, i) =>
                                                                        i === index
                                                                            ? { ...item, institution: e.target.value }
                                                                            : item,
                                                                    ),
                                                                },
                                                            })
                                                        }
                                                        fullWidth
                                                    />

                                                    <TextField
                                                        label="Degree"
                                                        variant="outlined"
                                                        margin="normal"
                                                        value={educationEntry.degree || ''}
                                                        onChange={(e) =>
                                                            handleEditData({
                                                                ...formData,
                                                                education: {
                                                                    ...formData.education,
                                                                    value: formData.education.value.map((item, i) =>
                                                                        i === index
                                                                            ? { ...item, degree: e.target.value }
                                                                            : item,
                                                                    ),
                                                                },
                                                            })
                                                        }
                                                        fullWidth
                                                    />

                                                    <TextField
                                                        label="Start Date"
                                                        variant="outlined"
                                                        margin="normal"
                                                        value={educationEntry.date.from}
                                                        onChange={(e) =>
                                                            handleEditData({
                                                                ...formData,
                                                                education: {
                                                                    ...formData.education,
                                                                    value: formData.education.value.map((item, i) =>
                                                                        i === index
                                                                            ? {
                                                                                  ...item,
                                                                                  date: {
                                                                                      ...item.date,
                                                                                      from: e.target.value,
                                                                                  },
                                                                              }
                                                                            : item,
                                                                    ),
                                                                },
                                                            })
                                                        }
                                                        fullWidth
                                                    />

                                                    <TextField
                                                        label="End Date"
                                                        variant="outlined"
                                                        margin="normal"
                                                        value={educationEntry.date.to || ''}
                                                        onChange={(e) =>
                                                            handleEditData({
                                                                ...formData,
                                                                education: {
                                                                    ...formData.education,
                                                                    value: formData.education.value.map((item, i) =>
                                                                        i === index
                                                                            ? {
                                                                                  ...item,
                                                                                  date: {
                                                                                      ...item.date,
                                                                                      to: e.target.value,
                                                                                  },
                                                                              }
                                                                            : item,
                                                                    ),
                                                                },
                                                            })
                                                        }
                                                        fullWidth
                                                    />

                                                    <Stack spacing={2}>
                                                        {educationEntry.description.map(
                                                            (descriptionEntry, descriptionIndex) => (
                                                                <Stack
                                                                    direction="row"
                                                                    spacing={2}
                                                                    key={descriptionIndex}
                                                                    alignItems="center"
                                                                >
                                                                    {educationEntry.description.length > 1 && (
                                                                        <IconButton
                                                                            onClick={() =>
                                                                                handleEditData({
                                                                                    ...formData,
                                                                                    education: {
                                                                                        ...formData.education,
                                                                                        value: (
                                                                                            formData.education.value ||
                                                                                            []
                                                                                        ).map((item, i) =>
                                                                                            i === index
                                                                                                ? {
                                                                                                      ...item,
                                                                                                      description:
                                                                                                          item.description.filter(
                                                                                                              (
                                                                                                                  descriptionItem,
                                                                                                                  descriptionItemIndex,
                                                                                                              ) =>
                                                                                                                  descriptionItemIndex !==
                                                                                                                  descriptionIndex,
                                                                                                          ),
                                                                                                  }
                                                                                                : item,
                                                                                        ),
                                                                                    },
                                                                                })
                                                                            }
                                                                            size="small"
                                                                            color="error"
                                                                        >
                                                                            <RemoveCircleIcon />
                                                                        </IconButton>
                                                                    )}

                                                                    <TextField
                                                                        label="Description"
                                                                        variant="outlined"
                                                                        margin="normal"
                                                                        value={descriptionEntry}
                                                                        onChange={(e) =>
                                                                            handleEditData({
                                                                                ...formData,
                                                                                education: {
                                                                                    ...formData.education,
                                                                                    value: (
                                                                                        formData.education.value || []
                                                                                    ).map((item, i) =>
                                                                                        i === index
                                                                                            ? {
                                                                                                  ...item,
                                                                                                  description:
                                                                                                      item.description.map(
                                                                                                          (
                                                                                                              descriptionItem,
                                                                                                              descriptionItemIndex,
                                                                                                          ) =>
                                                                                                              descriptionItemIndex ===
                                                                                                              descriptionIndex
                                                                                                                  ? e
                                                                                                                        .target
                                                                                                                        .value
                                                                                                                  : descriptionItem,
                                                                                                      ),
                                                                                              }
                                                                                            : item,
                                                                                    ),
                                                                                },
                                                                            })
                                                                        }
                                                                        fullWidth
                                                                        multiline
                                                                    />
                                                                </Stack>
                                                            ),
                                                        )}
                                                    </Stack>
                                                    <Box pl={educationEntry.description.length > 1 ? 6 : 0}>
                                                        <Button
                                                            variant="text"
                                                            onClick={() =>
                                                                handleEditData({
                                                                    ...formData,
                                                                    education: {
                                                                        ...formData.education,
                                                                        value: (formData.education.value || []).map(
                                                                            (item, i) =>
                                                                                i === index
                                                                                    ? {
                                                                                          ...item,
                                                                                          description: [
                                                                                              ...item.description,
                                                                                              '',
                                                                                          ],
                                                                                      }
                                                                                    : item,
                                                                        ),
                                                                    },
                                                                })
                                                            }
                                                            size="small"
                                                        >
                                                            Add Description
                                                        </Button>
                                                    </Box>
                                                </Stack>
                                            </Paper>
                                        ))}
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            handleEditData({
                                                ...formData,
                                                education: {
                                                    ...formData.education,
                                                    value: [
                                                        ...formData.education.value,
                                                        {
                                                            institution: '',
                                                            degree: '',
                                                            date: {
                                                                from: '',
                                                                to: '',
                                                            },
                                                            description: [''],
                                                        },
                                                    ],
                                                },
                                            })
                                        }
                                    >
                                        Add Education
                                    </Button>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                        {/* Experience */}
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="experience-content"
                                id="experience-header"
                            >
                                <Typography variant="h6">Experience</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl fullWidth>
                                    {Array.isArray(formData.experience.value) &&
                                        formData.experience.value.map((experienceEntry, index) => (
                                            <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    mb={2}
                                                >
                                                    <Typography variant="h6">Experience {index + 1}</Typography>
                                                    {experienceEntry.description.length > 1 && (
                                                        <IconButton
                                                            onClick={() =>
                                                                handleEditData({
                                                                    ...formData,
                                                                    experience: {
                                                                        ...formData.experience,
                                                                        value: formData.experience.value.filter(
                                                                            (item, i) => i !== index,
                                                                        ),
                                                                    },
                                                                })
                                                            }
                                                            size="small"
                                                            color="error"
                                                        >
                                                            <RemoveCircleIcon />
                                                        </IconButton>
                                                    )}
                                                </Stack>

                                                <TextField
                                                    label="Company"
                                                    variant="outlined"
                                                    margin="normal"
                                                    value={experienceEntry.company || ''}
                                                    onChange={(e) =>
                                                        handleEditData({
                                                            ...formData,
                                                            experience: {
                                                                ...formData.experience,
                                                                value: formData.experience.value.map((item, i) =>
                                                                    i === index
                                                                        ? { ...item, company: e.target.value }
                                                                        : item,
                                                                ),
                                                            },
                                                        })
                                                    }
                                                    fullWidth
                                                />

                                                <TextField
                                                    label="Location"
                                                    variant="outlined"
                                                    margin="normal"
                                                    value={experienceEntry.location || ''}
                                                    onChange={(e) =>
                                                        handleEditData({
                                                            ...formData,
                                                            experience: {
                                                                ...formData.experience,
                                                                value: formData.experience.value.map((item, i) =>
                                                                    i === index
                                                                        ? { ...item, location: e.target.value }
                                                                        : item,
                                                                ),
                                                            },
                                                        })
                                                    }
                                                    fullWidth
                                                />

                                                <TextField
                                                    label="Title"
                                                    variant="outlined"
                                                    margin="normal"
                                                    value={experienceEntry.title || ''}
                                                    onChange={(e) =>
                                                        handleEditData({
                                                            ...formData,
                                                            experience: {
                                                                ...formData.experience,
                                                                value: formData.experience.value.map((item, i) =>
                                                                    i === index
                                                                        ? { ...item, title: e.target.value }
                                                                        : item,
                                                                ),
                                                            },
                                                        })
                                                    }
                                                    fullWidth
                                                />

                                                <TextField
                                                    label="Start Date"
                                                    variant="outlined"
                                                    margin="normal"
                                                    value={experienceEntry.date.from}
                                                    onChange={(e) =>
                                                        handleEditData({
                                                            ...formData,
                                                            experience: {
                                                                ...formData.experience,
                                                                value: formData.experience.value.map((item, i) =>
                                                                    i === index
                                                                        ? {
                                                                              ...item,
                                                                              date: {
                                                                                  ...item.date,
                                                                                  from: e.target.value,
                                                                              },
                                                                          }
                                                                        : item,
                                                                ),
                                                            },
                                                        })
                                                    }
                                                    fullWidth
                                                />

                                                <TextField
                                                    label="End Date"
                                                    variant="outlined"
                                                    margin="normal"
                                                    value={experienceEntry.date.to || ''}
                                                    onChange={(e) =>
                                                        handleEditData({
                                                            ...formData,
                                                            experience: {
                                                                ...formData.experience,
                                                                value: formData.experience.value.map((item, i) =>
                                                                    i === index
                                                                        ? {
                                                                              ...item,
                                                                              date: {
                                                                                  ...item.date,
                                                                                  to: e.target.value,
                                                                              },
                                                                          }
                                                                        : item,
                                                                ),
                                                            },
                                                        })
                                                    }
                                                    fullWidth
                                                />

                                                <Stack spacing={2}>
                                                    {experienceEntry.description.map(
                                                        (descriptionEntry, descriptionIndex) => (
                                                            <Stack
                                                                direction="row"
                                                                spacing={2}
                                                                key={descriptionIndex}
                                                                alignItems="center"
                                                            >
                                                                {experienceEntry.description.length > 1 && (
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            handleEditData({
                                                                                ...formData,
                                                                                experience: {
                                                                                    ...formData.experience,
                                                                                    value: (
                                                                                        formData.experience.value || []
                                                                                    ).map((item, i) =>
                                                                                        i === index
                                                                                            ? {
                                                                                                  ...item,
                                                                                                  description:
                                                                                                      item.description.filter(
                                                                                                          (
                                                                                                              descriptionItem,
                                                                                                              descriptionItemIndex,
                                                                                                          ) =>
                                                                                                              descriptionItemIndex !==
                                                                                                              descriptionIndex,
                                                                                                      ),
                                                                                              }
                                                                                            : item,
                                                                                    ),
                                                                                },
                                                                            })
                                                                        }
                                                                        size="small"
                                                                        color="error"
                                                                    >
                                                                        <RemoveCircleIcon />
                                                                    </IconButton>
                                                                )}

                                                                <TextField
                                                                    label="Description"
                                                                    variant="outlined"
                                                                    margin="normal"
                                                                    value={descriptionEntry}
                                                                    onChange={(e) =>
                                                                        handleEditData({
                                                                            ...formData,
                                                                            experience: {
                                                                                ...formData.experience,
                                                                                value: (
                                                                                    formData.experience.value || []
                                                                                ).map((item, i) =>
                                                                                    i === index
                                                                                        ? {
                                                                                              ...item,
                                                                                              description:
                                                                                                  item.description.map(
                                                                                                      (
                                                                                                          descriptionItem,
                                                                                                          descriptionItemIndex,
                                                                                                      ) =>
                                                                                                          descriptionItemIndex ===
                                                                                                          descriptionIndex
                                                                                                              ? e.target
                                                                                                                    .value
                                                                                                              : descriptionItem,
                                                                                                  ),
                                                                                          }
                                                                                        : item,
                                                                                ),
                                                                            },
                                                                        })
                                                                    }
                                                                    fullWidth
                                                                    multiline
                                                                />
                                                            </Stack>
                                                        ),
                                                    )}
                                                </Stack>

                                                <Box pl={experienceEntry.description.length > 1 ? 6 : 0}>
                                                    <Button
                                                        variant="text"
                                                        onClick={() =>
                                                            handleEditData({
                                                                ...formData,
                                                                experience: {
                                                                    ...formData.experience,
                                                                    value: (formData.experience.value || []).map(
                                                                        (item, i) =>
                                                                            i === index
                                                                                ? {
                                                                                      ...item,
                                                                                      description: [
                                                                                          ...item.description,
                                                                                          '',
                                                                                      ],
                                                                                  }
                                                                                : item,
                                                                    ),
                                                                },
                                                            })
                                                        }
                                                        size="small"
                                                    >
                                                        Add Description
                                                    </Button>
                                                </Box>
                                            </Paper>
                                        ))}
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            handleEditData({
                                                ...formData,
                                                experience: {
                                                    ...formData.experience,
                                                    value: [
                                                        ...formData.experience.value,
                                                        {
                                                            company: '',
                                                            location: '',
                                                            title: '',
                                                            date: { from: '', to: '' },
                                                            description: [''],
                                                        },
                                                    ],
                                                },
                                            })
                                        }
                                    >
                                        Add Experience
                                    </Button>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>

                        {/* awards Section */}
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="awards-content"
                                id="awards-header"
                            >
                                <Typography variant="h6">Awards</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl fullWidth>
                                    {Array.isArray(formData.awards.value) &&
                                        formData.awards.value.map((awardsEntry, index) => (
                                            <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    mb={2}
                                                >
                                                    <Typography variant="h6">Awards {index + 1}</Typography>
                                                    {formData.awards.value.length > 1 && (
                                                        <IconButton
                                                            onClick={() =>
                                                                handleEditData({
                                                                    ...formData,
                                                                    awards: {
                                                                        ...formData.awards,
                                                                        value: formData.awards.value.filter(
                                                                            (item, i) => i !== index,
                                                                        ),
                                                                    },
                                                                })
                                                            }
                                                            size="small"
                                                            color="error"
                                                        >
                                                            <RemoveCircleIcon />
                                                        </IconButton>
                                                    )}
                                                </Stack>

                                                <Stack spacing={2} alignItems="stretch">
                                                    <TextField
                                                        label="Awards Name"
                                                        variant="outlined"
                                                        margin="normal"
                                                        value={awardsEntry.name || ''}
                                                        onChange={(e) =>
                                                            handleEditData({
                                                                ...formData,
                                                                awards: {
                                                                    ...formData.awards,
                                                                    value: formData.awards.value.map((item, i) =>
                                                                        i === index
                                                                            ? { ...item, name: e.target.value }
                                                                            : item,
                                                                    ),
                                                                },
                                                            })
                                                        }
                                                        fullWidth
                                                    />

                                                    <TextField
                                                        label="From"
                                                        variant="outlined"
                                                        margin="normal"
                                                        value={awardsEntry.from || ''}
                                                        onChange={(e) =>
                                                            handleEditData({
                                                                ...formData,
                                                                awards: {
                                                                    ...formData.awards,
                                                                    value: formData.awards.value.map((item, i) =>
                                                                        i === index
                                                                            ? { ...item, from: e.target.value }
                                                                            : item,
                                                                    ),
                                                                },
                                                            })
                                                        }
                                                        fullWidth
                                                    />

                                                    <TextField
                                                        label="Start Date"
                                                        variant="outlined"
                                                        margin="normal"
                                                        value={awardsEntry.date || ''}
                                                        onChange={(e) =>
                                                            handleEditData({
                                                                ...formData,
                                                                awards: {
                                                                    ...formData.awards,
                                                                    value: formData.awards.value.map((item, i) =>
                                                                        i === index
                                                                            ? {
                                                                                  ...item,
                                                                                  ...item.date,
                                                                                  from: e.target.value,
                                                                              }
                                                                            : item,
                                                                    ),
                                                                },
                                                            })
                                                        }
                                                        fullWidth
                                                    />

                                                    <Stack spacing={2}>
                                                        {awardsEntry.description.map(
                                                            (descriptionEntry, descriptionIndex) => (
                                                                <Stack
                                                                    direction="row"
                                                                    spacing={2}
                                                                    key={descriptionIndex}
                                                                    alignItems="center"
                                                                >
                                                                    {awardsEntry.description.length > 1 && (
                                                                        <IconButton
                                                                            onClick={() =>
                                                                                handleEditData({
                                                                                    ...formData,
                                                                                    awards: {
                                                                                        ...formData.awards,
                                                                                        value: (
                                                                                            formData.awards.value || []
                                                                                        ).map((item, i) =>
                                                                                            i === index
                                                                                                ? {
                                                                                                      ...item,
                                                                                                      description:
                                                                                                          item.description.filter(
                                                                                                              (
                                                                                                                  descriptionItem,
                                                                                                                  descriptionItemIndex,
                                                                                                              ) =>
                                                                                                                  descriptionItemIndex !==
                                                                                                                  descriptionIndex,
                                                                                                          ),
                                                                                                  }
                                                                                                : item,
                                                                                        ),
                                                                                    },
                                                                                })
                                                                            }
                                                                            size="small"
                                                                            color="error"
                                                                        >
                                                                            <RemoveCircleIcon />
                                                                        </IconButton>
                                                                    )}

                                                                    <TextField
                                                                        label="Description"
                                                                        variant="outlined"
                                                                        margin="normal"
                                                                        value={descriptionEntry}
                                                                        onChange={(e) =>
                                                                            handleEditData({
                                                                                ...formData,
                                                                                awards: {
                                                                                    ...formData.awards,
                                                                                    value: (
                                                                                        formData.awards.value || []
                                                                                    ).map((item, i) =>
                                                                                        i === index
                                                                                            ? {
                                                                                                  ...item,
                                                                                                  description:
                                                                                                      item.description.map(
                                                                                                          (
                                                                                                              descriptionItem,
                                                                                                              descriptionItemIndex,
                                                                                                          ) =>
                                                                                                              descriptionItemIndex ===
                                                                                                              descriptionIndex
                                                                                                                  ? e
                                                                                                                        .target
                                                                                                                        .value
                                                                                                                  : descriptionItem,
                                                                                                      ),
                                                                                              }
                                                                                            : item,
                                                                                    ),
                                                                                },
                                                                            })
                                                                        }
                                                                        fullWidth
                                                                        multiline
                                                                    />
                                                                </Stack>
                                                            ),
                                                        )}
                                                    </Stack>

                                                    {/* Add Description Button */}
                                                    <Box pl={awardsEntry.description.length > 1 ? 6 : 0}>
                                                        <Button
                                                            variant="text"
                                                            onClick={() =>
                                                                handleEditData({
                                                                    ...formData,
                                                                    awards: {
                                                                        ...formData.awards,
                                                                        value: (formData.awards.value || []).map(
                                                                            (item, i) =>
                                                                                i === index
                                                                                    ? {
                                                                                          ...item,
                                                                                          description: [
                                                                                              ...item.description,
                                                                                              '',
                                                                                          ],
                                                                                      }
                                                                                    : item,
                                                                        ),
                                                                    },
                                                                })
                                                            }
                                                            size="small"
                                                        >
                                                            Add Description
                                                        </Button>
                                                    </Box>
                                                </Stack>
                                            </Paper>
                                        ))}

                                    {/* Add Awards Button */}
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            handleEditData({
                                                ...formData,
                                                awards: {
                                                    ...formData.awards,
                                                    value: [
                                                        ...(formData.awards.value || []),
                                                        { name: '', from: '', date: '', description: [''] },
                                                    ],
                                                },
                                            })
                                        }
                                    >
                                        Add Awards
                                    </Button>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>

                        {/* Languages */}
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="language-content"
                                id="language-header"
                            >
                                <Typography variant="h6">Languages</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl fullWidth>
                                    {Array.isArray(formData.languages.value) &&
                                        formData.languages.value.map((languageEntry, index) => (
                                            <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    mb={2}
                                                >
                                                    <Typography variant="h6">Language {index + 1}</Typography>
                                                    {formData.languages.value.length > 1 && (
                                                        <IconButton
                                                            onClick={() =>
                                                                handleEditData({
                                                                    ...formData,
                                                                    languages: {
                                                                        ...formData.languages,
                                                                        value: formData.languages.value.filter(
                                                                            (item, i) => i !== index,
                                                                        ),
                                                                    },
                                                                })
                                                            }
                                                            size="small"
                                                            color="error"
                                                        >
                                                            <RemoveCircleIcon />
                                                        </IconButton>
                                                    )}
                                                </Stack>

                                                <Stack spacing={2} alignItems="stretch">
                                                    <TextField
                                                        label="Language Name"
                                                        variant="outlined"
                                                        margin="normal"
                                                        value={languageEntry.name || ''}
                                                        onChange={(e) =>
                                                            handleEditData({
                                                                ...formData,
                                                                languages: {
                                                                    ...formData.languages,
                                                                    value: formData.languages.value.map((item, i) =>
                                                                        i === index
                                                                            ? { ...item, name: e.target.value }
                                                                            : item,
                                                                    ),
                                                                },
                                                            })
                                                        }
                                                        fullWidth
                                                    />

                                                    <FormControl fullWidth variant="outlined" margin="normal">
                                                        <InputLabel>Proficiency Level</InputLabel>
                                                        <Select
                                                            label="Proficiency Level"
                                                            value={languageEntry.level || ''}
                                                            onChange={(e) =>
                                                                handleEditData({
                                                                    ...formData,
                                                                    languages: {
                                                                        ...formData.languages,
                                                                        value: formData.languages.value.map(
                                                                            (item, i) =>
                                                                                i === index
                                                                                    ? { ...item, level: e.target.value }
                                                                                    : item,
                                                                        ),
                                                                    },
                                                                })
                                                            }
                                                        >
                                                            <MenuItem value="Beginner">Beginner</MenuItem>
                                                            <MenuItem value="Elementary">Elementary</MenuItem>
                                                            <MenuItem value="Intermediate">Intermediate</MenuItem>
                                                            <MenuItem value="Upper Intermediate">
                                                                Upper Intermediate
                                                            </MenuItem>
                                                            <MenuItem value="Advanced">Advanced</MenuItem>
                                                            <MenuItem value="Mastery">Mastery</MenuItem>
                                                            <MenuItem value="Native">Native</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Stack>
                                            </Paper>
                                        ))}

                                    {/* Add Language Button */}
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            handleEditData({
                                                ...formData,
                                                languages: {
                                                    ...formData.languages,
                                                    value: [
                                                        ...(formData.languages.value || []),
                                                        { name: '', level: '' },
                                                    ],
                                                },
                                            })
                                        }
                                    >
                                        Add Language
                                    </Button>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>

                        {/* Technical Skills Section */}
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="technicalSkills-content"
                                id="technicalSkills-header"
                            >
                                <Typography variant="h6">Technical Skills</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl fullWidth>
                                    {Array.isArray(formData.technicalSkills.value) &&
                                        formData.technicalSkills.value.map((technicalSkillsEntry, index) => (
                                            <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    mb={2}
                                                >
                                                    <Typography variant="h6">Technical Skills {index + 1}</Typography>
                                                    {formData.technicalSkills.value.length > 1 && (
                                                        <IconButton
                                                            onClick={() =>
                                                                handleEditData({
                                                                    ...formData,
                                                                    technicalSkills: {
                                                                        ...formData.technicalSkills,
                                                                        value: formData.technicalSkills.value.filter(
                                                                            (item, i) => i !== index,
                                                                        ),
                                                                    },
                                                                })
                                                            }
                                                            size="small"
                                                            color="error"
                                                        >
                                                            <RemoveCircleIcon />
                                                        </IconButton>
                                                    )}
                                                </Stack>

                                                <Stack spacing={2} alignItems="stretch">
                                                    <TextField
                                                        label="Technical Skills"
                                                        variant="outlined"
                                                        margin="normal"
                                                        value={technicalSkillsEntry.name || ''}
                                                        onChange={(e) =>
                                                            handleEditData({
                                                                ...formData,
                                                                technicalSkills: {
                                                                    ...formData.technicalSkills,
                                                                    value: formData.technicalSkills.value.map(
                                                                        (item, i) =>
                                                                            i === index
                                                                                ? { ...item, name: e.target.value }
                                                                                : item,
                                                                    ),
                                                                },
                                                            })
                                                        }
                                                        fullWidth
                                                    />

                                                    <FormControl fullWidth variant="outlined" margin="normal">
                                                        <InputLabel>Proficiency Level</InputLabel>
                                                        <Select
                                                            label="Proficiency Level"
                                                            value={technicalSkillsEntry.level || ''}
                                                            onChange={(e) =>
                                                                handleEditData({
                                                                    ...formData,
                                                                    technicalSkills: {
                                                                        ...formData.technicalSkills,
                                                                        value: formData.technicalSkills.value.map(
                                                                            (item, i) =>
                                                                                i === index
                                                                                    ? { ...item, level: e.target.value }
                                                                                    : item,
                                                                        ),
                                                                    },
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
                                                </Stack>
                                            </Paper>
                                        ))}

                                    {/* Add Technical Skills Button */}
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            handleEditData({
                                                ...formData,
                                                technicalSkills: {
                                                    ...formData.technicalSkills,
                                                    value: [
                                                        ...(formData.technicalSkills.value || []),
                                                        { name: '', level: '' },
                                                    ],
                                                },
                                            })
                                        }
                                    >
                                        Add Technical Skill
                                    </Button>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>

                        {/* SoftSkill */}
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="softSkills-content"
                                id="softSkills-header"
                            >
                                <Typography variant="h6">Soft Skills</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl fullWidth>
                                    {Array.isArray(formData.softSkills?.value) &&
                                        formData.softSkills?.value?.map((softSkillsEntry, index) => (
                                            <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    mb={2}
                                                >
                                                    <Typography variant="h6">Soft Skill {index + 1}</Typography>
                                                    {formData.softSkills?.value.length > 1 && (
                                                        <IconButton
                                                            onClick={() =>
                                                                handleEditData({
                                                                    ...formData,
                                                                    softSkills: {
                                                                        ...formData.softSkills,
                                                                        value: formData.softSkills.value.filter(
                                                                            (item, i) => i !== index,
                                                                        ),
                                                                    },
                                                                })
                                                            }
                                                            size="small"
                                                            color="error"
                                                        >
                                                            <RemoveCircleIcon />
                                                        </IconButton>
                                                    )}
                                                </Stack>

                                                <Stack spacing={2} alignItems="stretch">
                                                    <TextField
                                                        label="Soft Skill Name"
                                                        variant="outlined"
                                                        margin="normal"
                                                        value={softSkillsEntry.name || ''}
                                                        onChange={(e) =>
                                                            handleEditData({
                                                                ...formData,
                                                                softSkills: {
                                                                    ...formData.softSkills,
                                                                    value: formData.softSkills.value.map((item, i) =>
                                                                        i === index
                                                                            ? { ...item, name: e.target.value }
                                                                            : item,
                                                                    ),
                                                                },
                                                            })
                                                        }
                                                        fullWidth
                                                    />
                                                </Stack>
                                            </Paper>
                                        ))}

                                    {/* Add Soft Skill Button */}
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            handleEditData({
                                                ...formData,
                                                softSkills: {
                                                    ...formData.softSkills,
                                                    value: [...(formData.softSkills.value || []), { name: '' }],
                                                },
                                            })
                                        }
                                    >
                                        Add Soft Skill
                                    </Button>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>

                        {/* Volunteering Section */}
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="volunteering-content"
                                id="volunteering-header"
                            >
                                <Typography variant="h6">Volunteering</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl fullWidth>
                                    {Array.isArray(formData.voluntering.value) &&
                                        formData.voluntering.value.map((volunteeringEntry, index) => (
                                            <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    mb={2}
                                                >
                                                    <Typography variant="h6">Volunteering {index + 1}</Typography>
                                                    {formData.voluntering.value.length > 1 && (
                                                        <IconButton
                                                            onClick={() =>
                                                                handleEditData({
                                                                    ...formData,
                                                                    voluntering: {
                                                                        ...formData.voluntering,
                                                                        value: formData.voluntering.value.filter(
                                                                            (item, i) => i !== index,
                                                                        ),
                                                                    },
                                                                })
                                                            }
                                                            size="small"
                                                            color="error"
                                                        >
                                                            <RemoveCircleIcon />
                                                        </IconButton>
                                                    )}
                                                </Stack>

                                                <Stack spacing={2} alignItems="stretch">
                                                    <TextField
                                                        label="Organization Name"
                                                        variant="outlined"
                                                        margin="normal"
                                                        value={volunteeringEntry.name || ''}
                                                        onChange={(e) =>
                                                            handleEditData({
                                                                ...formData,
                                                                voluntering: {
                                                                    ...formData.voluntering,
                                                                    value: formData.voluntering.value.map((item, i) =>
                                                                        i === index
                                                                            ? { ...item, name: e.target.value }
                                                                            : item,
                                                                    ),
                                                                },
                                                            })
                                                        }
                                                        fullWidth
                                                    />

                                                    <TextField
                                                        label="Start Date"
                                                        variant="outlined"
                                                        margin="normal"
                                                        value={volunteeringEntry.date.from}
                                                        onChange={(e) =>
                                                            handleEditData({
                                                                ...formData,
                                                                voluntering: {
                                                                    ...formData.voluntering,
                                                                    value: formData.voluntering.value.map((item, i) =>
                                                                        i === index
                                                                            ? {
                                                                                  ...item,
                                                                                  date: {
                                                                                      ...item.date,
                                                                                      from: e.target.value,
                                                                                  },
                                                                              }
                                                                            : item,
                                                                    ),
                                                                },
                                                            })
                                                        }
                                                        fullWidth
                                                    />

                                                    <TextField
                                                        label="End Date"
                                                        variant="outlined"
                                                        margin="normal"
                                                        value={volunteeringEntry.date.to || ''}
                                                        onChange={(e) =>
                                                            handleEditData({
                                                                ...formData,
                                                                voluntering: {
                                                                    ...formData.voluntering,
                                                                    value: formData.voluntering.value.map((item, i) =>
                                                                        i === index
                                                                            ? {
                                                                                  ...item,
                                                                                  date: {
                                                                                      ...item.date,
                                                                                      to: e.target.value,
                                                                                  },
                                                                              }
                                                                            : item,
                                                                    ),
                                                                },
                                                            })
                                                        }
                                                        fullWidth
                                                    />

                                                    <Stack spacing={2}>
                                                        {volunteeringEntry.description.map(
                                                            (descriptionEntry, descriptionIndex) => (
                                                                <Stack
                                                                    direction="row"
                                                                    spacing={2}
                                                                    key={descriptionIndex}
                                                                    alignItems="center"
                                                                >
                                                                    {volunteeringEntry.description.length > 1 && (
                                                                        <IconButton
                                                                            onClick={() =>
                                                                                handleEditData({
                                                                                    ...formData,
                                                                                    voluntering: {
                                                                                        ...formData.voluntering,
                                                                                        value: formData.voluntering.value.map(
                                                                                            (item, i) =>
                                                                                                i === index
                                                                                                    ? {
                                                                                                          ...item,
                                                                                                          description:
                                                                                                              item.description.filter(
                                                                                                                  (
                                                                                                                      descriptionItem,
                                                                                                                      descriptionItemIndex,
                                                                                                                  ) =>
                                                                                                                      descriptionItemIndex !==
                                                                                                                      descriptionIndex,
                                                                                                              ),
                                                                                                      }
                                                                                                    : item,
                                                                                        ),
                                                                                    },
                                                                                })
                                                                            }
                                                                            size="small"
                                                                            color="error"
                                                                        >
                                                                            <RemoveCircleIcon />
                                                                        </IconButton>
                                                                    )}

                                                                    <TextField
                                                                        label="Description"
                                                                        variant="outlined"
                                                                        margin="normal"
                                                                        value={descriptionEntry}
                                                                        onChange={(e) =>
                                                                            handleEditData({
                                                                                ...formData,
                                                                                voluntering: {
                                                                                    ...formData.voluntering,
                                                                                    value: formData.volunteering.value.map(
                                                                                        (item, i) =>
                                                                                            i === index
                                                                                                ? {
                                                                                                      ...item,
                                                                                                      description:
                                                                                                          item.description.map(
                                                                                                              (
                                                                                                                  descriptionItem,
                                                                                                                  descriptionItemIndex,
                                                                                                              ) =>
                                                                                                                  descriptionItemIndex ===
                                                                                                                  descriptionIndex
                                                                                                                      ? e
                                                                                                                            .target
                                                                                                                            .value
                                                                                                                      : descriptionItem,
                                                                                                          ),
                                                                                                  }
                                                                                                : item,
                                                                                    ),
                                                                                },
                                                                            })
                                                                        }
                                                                        fullWidth
                                                                        multiline
                                                                    />
                                                                </Stack>
                                                            ),
                                                        )}
                                                    </Stack>
                                                    <Box pl={volunteeringEntry.description.length > 1 ? 6 : 0}>
                                                        <Button
                                                            variant="text"
                                                            onClick={() =>
                                                                handleEditData({
                                                                    ...formData,
                                                                    voluntering: {
                                                                        ...formData.voluntering,
                                                                        value: formData.voluntering.value.map(
                                                                            (item, i) =>
                                                                                i === index
                                                                                    ? {
                                                                                          ...item,
                                                                                          description: [
                                                                                              ...item.description,
                                                                                              '',
                                                                                          ],
                                                                                      }
                                                                                    : item,
                                                                        ),
                                                                    },
                                                                })
                                                            }
                                                            size="small"
                                                        >
                                                            Add Description
                                                        </Button>
                                                    </Box>
                                                </Stack>
                                            </Paper>
                                        ))}

                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            handleEditData({
                                                ...formData,
                                                voluntering: {
                                                    ...formData.voluntering,
                                                    value: [
                                                        ...(formData.voluntering.value || []),
                                                        { name: '', date: { from: '', to: '' }, description: [''] },
                                                    ],
                                                },
                                            })
                                        }
                                    >
                                        Add Volunteering
                                    </Button>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="references-content"
                                id="references-header"
                            >
                                <Typography variant="h6">References</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {formData.references.value.map((reference, index) => (
                                    <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            alignItems="center"
                                            justifyContent="space-between"
                                            mb={2}
                                        >
                                            <Typography variant="h6">Reference {index + 1}</Typography>

                                            <IconButton
                                                onClick={() =>
                                                    handleEditData({
                                                        ...formData,
                                                        references: {
                                                            ...formData.references,
                                                            value: formData.references.value.filter(
                                                                (item, i) => i !== index,
                                                            ),
                                                        },
                                                    })
                                                }
                                                size="small"
                                                color="error"
                                            >
                                                <RemoveCircleIcon />
                                            </IconButton>
                                        </Stack>
                                        <TextField
                                            value={reference.name}
                                            onChange={(e) =>
                                                handleEditData({
                                                    ...formData,
                                                    references: {
                                                        ...formData.references,
                                                        value: formData.references.value.map((item, i) =>
                                                            i === index ? { ...item, name: e.target.value } : item,
                                                        ),
                                                    },
                                                })
                                            }
                                            label="Name"
                                            variant="outlined"
                                            margin="normal"
                                            fullWidth
                                        />
                                        <TextField
                                            value={reference.company}
                                            onChange={(e) =>
                                                handleEditData({
                                                    ...formData,
                                                    references: {
                                                        ...formData.references,
                                                        value: formData.references.value.map((item, i) =>
                                                            i === index ? { ...item, company: e.target.value } : item,
                                                        ),
                                                    },
                                                })
                                            }
                                            label="Company"
                                            variant="outlined"
                                            margin="normal"
                                            fullWidth
                                        />
                                        <TextField
                                            value={reference.phone}
                                            onChange={(e) =>
                                                handleEditData({
                                                    ...formData,
                                                    references: {
                                                        ...formData.references,
                                                        value: formData.references.value.map((item, i) =>
                                                            i === index ? { ...item, phone: e.target.value } : item,
                                                        ),
                                                    },
                                                })
                                            }
                                            label="Phone"
                                            variant="outlined"
                                            margin="normal"
                                            fullWidth
                                        />
                                        <TextField
                                            value={reference.email}
                                            onChange={(e) =>
                                                handleEditData({
                                                    ...formData,
                                                    references: {
                                                        ...formData.references,
                                                        value: formData.references.value.map((item, i) =>
                                                            i === index ? { ...item, email: e.target.value } : item,
                                                        ),
                                                    },
                                                })
                                            }
                                            label="Email"
                                            variant="outlined"
                                            margin="normal"
                                            fullWidth
                                        />
                                    </Paper>
                                ))}
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        handleEditData({
                                            ...formData,
                                            references: {
                                                ...formData.references,
                                                value: [
                                                    ...formData.references.value,
                                                    { name: '', company: '', phone: '', email: '' },
                                                ],
                                            },
                                        })
                                    }
                                >
                                    Add Reference
                                </Button>
                            </AccordionDetails>
                        </Accordion>
                    </Stack>
                </Box>
            </Drawer>
        </Box>
    );
}
