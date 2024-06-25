import {
    Box,
    Button,
    MenuItem,
    Paper,
    Select,
    Stack,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography,
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel,
} from '@mui/material';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCreate } from '@features/job/jobSlice';
import NumberInput from './numberInput';
import cloneDeep from 'lodash/cloneDeep';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

const industryList = [
    'agriculture',
    'manufacturing',
    'construction',
    'wholesale',
    'retail',
    'transportation',
    'information',
    'finance',
    'real estate',
    'professional',
    'scientific',
    'technical',
    'management',
    'administrative',
    'waste management',
    'remediation',
    'educational',
    'healthcare',
    'arts',
    'entertainment',
    'recreation',
    'accommodation',
    'food services',
    'other',
];

export default function JobRequirement(props) {
    const { onBack, onNext, ...other } = props;
    const {
        qualification,
        experience,
        salaryRange,
        technicalSkills,
        softSkills,
        languages,
        environment,
        industry,
        quota,
        gender,
    } = useSelector((state) => state.job.create);
    const dispatch = useDispatch();

    const [technicalSkillsText, setTechnicalSkillsText] = useState('');
    const [softSkillsText, setSoftSkilllsText] = useState('');

    const [languageText, setLanguageText] = useState('');

    return (
        <Stack spacing={3} {...other}>
            <Box>
                <Typography variant="h6">What is the job requirement?</Typography>
            </Box>
            <Stack spacing={3}>
                <Stack>
                    <Typography variant="subtitle2">Minimum Qualification</Typography>
                    <Select
                        fullWidth
                        name="qualification"
                        inputProps={{ 'aria-label': 'Without label' }}
                        onChange={(e) => dispatch(setCreate({ name: 'qualification', value: e.target.value }))}
                        value={qualification}
                    >
                        <MenuItem value="SPM">Sijil Pelajaran Malaysia</MenuItem>
                        <MenuItem value="STPM">Sijil Tinggi Pelajaran Malaysia</MenuItem>
                        <MenuItem value="Diploma">Diploma</MenuItem>
                        <MenuItem value="Degree">Degree</MenuItem>
                        <MenuItem value="Master">Master</MenuItem>
                        <MenuItem value="PhD">PhD</MenuItem>
                    </Select>
                </Stack>
                <Stack>
                    <Typography variant="subtitle2">Minimum Experience</Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box>
                            <NumberInput
                                placeholder="Type a number…"
                                min={0}
                                value={experience[0]}
                                onChange={(event, val) =>
                                    dispatch(setCreate({ name: 'experience', value: [val, experience[1]] }))
                                }
                            />
                        </Box>
                        <Typography variant="subtitle2">to</Typography>
                        <Box>
                            <NumberInput
                                placeholder="Type a number…"
                                min={0}
                                value={experience[1]}
                                onChange={(event, val) =>
                                    dispatch(setCreate({ name: 'experience', value: [experience[0], val] }))
                                }
                            />
                        </Box>
                    </Stack>
                </Stack>
                <Stack>
                    <Typography variant="subtitle2">Salary Range</Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="subtitle2">RM</Typography>
                        <Box>
                            <NumberInput
                                placeholder="Type a number…"
                                min={0}
                                value={salaryRange[0]}
                                onChange={(event, val) =>
                                    dispatch(setCreate({ name: 'salaryRange', value: [val, salaryRange[1]] }))
                                }
                            />
                        </Box>
                        <Typography variant="subtitle2">to</Typography>
                        <Box>
                            <NumberInput
                                placeholder="Type a number…"
                                min={0}
                                value={salaryRange[1]}
                                onChange={(event, val) =>
                                    dispatch(setCreate({ name: 'salaryRange', value: [salaryRange[0], val] }))
                                }
                            />
                        </Box>
                    </Stack>
                </Stack>
                <Stack spacing={2}>
                    <Typography variant="subtitle2">Gender</Typography>
                    <FormControl component="fieldset">
                        <RadioGroup
                            aria-label="gender"
                            name="gender"
                            value={gender}
                            onChange={(event, val) => dispatch(setCreate({ name: 'gender', value: val }))}
                            row
                        >
                            <FormControlLabel value="All" control={<Radio />} label="All" />
                            <FormControlLabel value="Female" control={<Radio />} label="Female" />
                            <FormControlLabel value="Male" control={<Radio />} label="Male" />
                        </RadioGroup>
                    </FormControl>
                </Stack>
                <Stack>
                    <Typography variant="subtitle2">Languages</Typography>
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                        <TextField
                            fullWidth
                            name="languages"
                            value={languageText}
                            onChange={(e) => setLanguageText(e.target.value)}
                            variant="outlined"
                        />
                        <IconButton
                            variant="contained"
                            onClick={() => {
                                dispatch(
                                    setCreate({
                                        name: 'languages',
                                        value: [
                                            ...languages,
                                            {
                                                name: languageText,
                                                level: 'Beginner',
                                            },
                                        ],
                                    }),
                                );
                                setLanguageText('');
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Stack>
                    <Paper p={2}>
                        <Table>
                            <TableBody>
                                {languages.map((language, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                value={language.name}
                                                onChange={(e) => {
                                                    const newLanguages = cloneDeep(languages);
                                                    newLanguages[index].name = e.target.value;
                                                    dispatch(
                                                        setCreate({
                                                            name: 'languages',
                                                            value: newLanguages,
                                                        }),
                                                    );
                                                }}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                fullWidth
                                                name="level"
                                                value={language.level}
                                                onChange={(e) => {
                                                    const newLanguages = cloneDeep(languages);
                                                    newLanguages[index].level = e.target.value;
                                                    dispatch(
                                                        setCreate({
                                                            name: 'languages',
                                                            value: newLanguages,
                                                        }),
                                                    );
                                                }}
                                            >
                                                <MenuItem value="Beginner">Beginner</MenuItem>
                                                <MenuItem value="Elementary">Elementary</MenuItem>
                                                <MenuItem value="Intermediate">Intermediate</MenuItem>
                                                <MenuItem value="Upper Intermediate">Upper Intermediate</MenuItem>
                                                <MenuItem value="Advanced">Advanced</MenuItem>
                                                <MenuItem value="Mastery">Mastery</MenuItem>
                                                <MenuItem value="Native">Native</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                variant="contained"
                                                onClick={() => {
                                                    dispatch(
                                                        setCreate({
                                                            name: 'languages',
                                                            value: languages.filter((language, i) => i !== index),
                                                        }),
                                                    );
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Stack>
                <Stack>
                    <Typography variant="subtitle2">Technical Skills</Typography>
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                        <TextField
                            fullWidth
                            name="technicalSkills"
                            value={technicalSkillsText}
                            onChange={(e) => setTechnicalSkillsText(e.target.value)}
                            variant="outlined"
                        />
                        <IconButton
                            variant="contained"
                            onClick={() => {
                                dispatch(
                                    setCreate({
                                        name: 'technicalSkills',
                                        value: [
                                            ...technicalSkills,
                                            {
                                                name: technicalSkillsText,
                                                level: 'Fundamental',
                                            },
                                        ],
                                    }),
                                );
                                setTechnicalSkillsText('');
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Stack>
                    <Paper p={2}>
                        <Table>
                            <TableBody>
                                {technicalSkills.map((technicalSkill, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                value={technicalSkill.name}
                                                onChange={(e) => {
                                                    const newTechnicalSkills = cloneDeep(technicalSkills);
                                                    newTechnicalSkills[index].name = e.target.value;
                                                    dispatch(
                                                        setCreate({
                                                            name: 'technicalSkills',
                                                            value: newTechnicalSkills,
                                                        }),
                                                    );
                                                }}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                fullWidth
                                                name="level"
                                                value={technicalSkill.level}
                                                onChange={(e) => {
                                                    const newTechnicalSkills = cloneDeep(technicalSkills);
                                                    newTechnicalSkills[index].level = e.target.value;
                                                    dispatch(
                                                        setCreate({
                                                            name: 'technicalSkills',
                                                            value: newTechnicalSkills,
                                                        }),
                                                    );
                                                }}
                                            >
                                                <MenuItem value="Fundamental">Fundamental</MenuItem>
                                                <MenuItem value="Novice">Novice</MenuItem>
                                                <MenuItem value="Intermediate">Intermediate</MenuItem>
                                                <MenuItem value="Advanced">Advanced</MenuItem>
                                                <MenuItem value="Expert">Expert</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                variant="contained"
                                                onClick={() => {
                                                    dispatch(
                                                        setCreate({
                                                            name: 'technicalSkills',
                                                            value: technicalSkills.filter(
                                                                (technicalSkill, i) => i !== index,
                                                            ),
                                                        }),
                                                    );
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Stack>
                <Stack>
                    <Typography variant="subtitle2">Soft Skills</Typography>
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                        <TextField
                            fullWidth
                            name="softSkills"
                            value={softSkillsText}
                            onChange={(e) => setSoftSkilllsText(e.target.value)}
                            variant="outlined"
                        />
                        <IconButton
                            variant="contained"
                            onClick={() => {
                                dispatch(
                                    setCreate({
                                        name: 'softSkills',
                                        value: [
                                            ...softSkills,
                                            {
                                                name: softSkillsText,
                                            },
                                        ],
                                    }),
                                );
                                setSoftSkilllsText('');
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Stack>
                    <Paper p={2}>
                        <Table>
                            <TableBody>
                                {softSkills.map((softSkill, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                value={softSkill.name}
                                                onChange={(e) => {
                                                    const newSoftSkills = cloneDeep(softSkills);
                                                    newSoftSkills[index].name = e.target.value;
                                                    dispatch(
                                                        setCreate({
                                                            name: 'softSkills',
                                                            value: newSoftSkills,
                                                        }),
                                                    );
                                                }}
                                                variant="outlined"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <IconButton
                                                variant="contained"
                                                onClick={() => {
                                                    dispatch(
                                                        setCreate({
                                                            name: 'softSkills',
                                                            value: softSkills.filter((softSkill, i) => i !== index),
                                                        }),
                                                    );
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Stack>
                <Stack>
                    <Typography variant="subtitle2">Environment</Typography>
                    <Select
                        fullWidth
                        name="environment"
                        value={environment}
                        onChange={(e) => dispatch(setCreate({ name: 'environment', value: e.target.value }))}
                    >
                        <MenuItem value="Remote">Remote</MenuItem>
                        <MenuItem value="On-site">On-site</MenuItem>
                        <MenuItem value="Flexible">Flexible</MenuItem>
                    </Select>
                </Stack>
                <Stack>
                    <Typography variant="subtitle2">Industry</Typography>
                    <Select
                        fullWidth
                        name="industry"
                        value={industry}
                        onChange={(e) => dispatch(setCreate({ name: 'industry', value: e.target.value }))}
                    >
                        {industryList.map((industry) => (
                            <MenuItem key={industry} value={industry}>
                                {industry}
                            </MenuItem>
                        ))}
                    </Select>
                </Stack>
                <Stack>
                    <Typography variant="subtitle2">Quota</Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box>
                            <NumberInput
                                placeholder="Type a number…"
                                min={0}
                                value={quota}
                                onChange={(event, val) => dispatch(setCreate({ name: 'quota', value: val }))}
                            />
                        </Box>
                    </Stack>
                </Stack>
            </Stack>
            <Stack alignItems="center" direction="row" spacing={2}>
                <Button
                    endIcon={
                        <SvgIcon>
                            <ArrowRightIcon />
                        </SvgIcon>
                    }
                    onClick={onNext}
                    variant="contained"
                >
                    Continue
                </Button>
                <Button color="inherit" onClick={onBack}>
                    Back
                </Button>
            </Stack>
        </Stack>
    );
}

JobRequirement.propTypes = {
    onBack: PropTypes.func,
    onNext: PropTypes.func,
};
