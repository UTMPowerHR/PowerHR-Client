import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import ShortTextIcon from '@mui/icons-material/ShortText';
import SubjectIcon from '@mui/icons-material/Subject';
import {
    Divider,
    FormControl,
    Grid,
    ListItemText,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setQuestion } from '../../../../../features/form/formSlice';

function QuestionHeaderExpand(props) {
    const { id } = props;
    const question = useSelector((state) => state.form.form.questions.find((question) => question._id === id));

    const dispatch = useDispatch();

    const handleOnChangeText = (e) => {
        let newQuestion = { ...question };
        newQuestion.questionText = e.target.value;
        dispatch(setQuestion(newQuestion));
    };

    const handleOnChangeType = (e) => {
        let newQuestion = { ...question };
        newQuestion.questionType = e.target.value;
        if (e.target.value === 'Short Answer' || e.target.value === 'Paragraph') {
            if (question.questionType !== 'Short Answer' && question.questionType !== 'Paragraph') {
                newQuestion.options = [];
            }
        } else if (
            e.target.value === 'Multiple Choice' ||
            e.target.value === 'Checkboxes' ||
            e.target.value === 'Drop-down'
        ) {
            if (
                question.questionType !== 'Multiple Choice' &&
                question.questionType !== 'Checkboxes' &&
                question.questionType !== 'Drop-down'
            ) {
                newQuestion.options = [
                    {
                        _id: 'new' + crypto.randomUUID(),
                        optionText: 'Option 1',
                    },
                ];
            }
        } else if (e.target.value === 'Linear Scale') {
            if (question.questionType !== 'Linear Scale') {
                newQuestion.options = [
                    {
                        _id: 'new' + crypto.randomUUID(),
                        optionText: '',
                        optionScale: 1,
                    },
                    {
                        _id: 'new' + crypto.randomUUID(),
                        optionText: '',
                        optionScale: 5,
                    },
                ];
            }
        }

        dispatch(setQuestion(newQuestion));
    };

    return (
        <Grid container spacing={2} mb={2}>
            <Grid item md={8} xs={12}>
                <TextField
                    fullWidth
                    id="questionText"
                    placeholder="Question Text"
                    variant="outlined"
                    value={question?.questionText}
                    onChange={handleOnChangeText}
                    inputProps={{
                        style: {
                            fontSize: 17,
                        },
                    }}
                />
            </Grid>
            <Grid item md={4} xs={12}>
                <FormControl sx={{ width: '100%' }}>
                    <Select
                        value={question.questionType}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        onChange={handleOnChangeType}
                    >
                        <MenuItem value={'Short Answer'}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <ShortTextIcon />
                                <ListItemText primary="Short Answer" />
                            </Stack>
                        </MenuItem>
                        <MenuItem value={'Paragraph'}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <SubjectIcon />
                                <ListItemText primary="Paragraph" />
                            </Stack>
                        </MenuItem>
                        <Divider sx={{ borderBottomWidth: 2, bgcolor: 'black' }} />
                        <MenuItem value={'Multiple Choice'}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <RadioButtonCheckedIcon />
                                <ListItemText primary="Multiple Choice" />
                            </Stack>
                        </MenuItem>
                        <MenuItem value={'Checkboxes'}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <CheckBoxIcon />
                                <ListItemText primary="Checkboxes" />
                            </Stack>
                        </MenuItem>
                        <MenuItem value={'Drop-down'}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <ArrowDropDownCircleIcon />
                                <ListItemText primary="Drop-down" />
                            </Stack>
                        </MenuItem>
                        <Divider sx={{ borderBottomWidth: 2, bgcolor: 'black' }} />
                        <MenuItem value={'Linear Scale'}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <LinearScaleIcon />
                                <ListItemText primary="Linear Scale" />
                            </Stack>
                        </MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
}

QuestionHeaderExpand.propTypes = {
    id: PropTypes.string,
};

function QuestionHeaderCollapse(props) {
    const { id } = props;

    const question = useSelector((state) => state.form.form.questions.find((question) => question._id === id));

    return (
        <Grid container spacing={2} mb={1}>
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">
                        <Stack direction="row">
                            {question.questionText}
                            {question.required ? (
                                <Typography color="error" ml={1}>
                                    *
                                </Typography>
                            ) : (
                                ''
                            )}
                        </Stack>
                    </Typography>
                </Stack>
            </Grid>
        </Grid>
    );
}

QuestionHeaderCollapse.propTypes = {
    id: PropTypes.string,
};

function QuestionHeader(props) {
    const { id, expand } = props;

    return <>{expand ? <QuestionHeaderExpand id={id} /> : <QuestionHeaderCollapse id={id} />}</>;
}

QuestionHeader.propTypes = {
    id: PropTypes.string,
    expand: PropTypes.bool,
};

export default QuestionHeader;
