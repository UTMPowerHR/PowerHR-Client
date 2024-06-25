import {
    Grid,
    Typography,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    Stack,
    Button,
    IconButton,
} from '@mui/material';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { addOption, setOption, deleteOption } from '../../../../../features/form/formSlice';

function MultipleChoiceExpand(props) {
    const { id } = props;
    const options = useSelector((state) => state.form.form.questions.find((question) => question._id === id)?.options);

    const dispatch = useDispatch();

    const handleAddOption = () => {
        const newOption = {
            _id: 'new' + crypto.randomUUID(),
            optionText: 'Option ' + (options.length + 1),
        };

        dispatch(addOption({ questionId: id, option: newOption }));
    };

    const handleDeleteOption = (optionId) => {
        dispatch(deleteOption({ questionId: id, optionId }));
    };

    const handleOnChange = (e) => {
        const option = options.find((option) => option._id === e.target.id);
        let newOption = { ...option };
        newOption.optionText = e.target.value;

        dispatch(setOption({ questionId: id, option: newOption }));
    };

    return (
        <Grid container spacing={2}>
            {options.map((option) => (
                <Grid item xs={12} key={option._id}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormControl disabled>
                            <Radio />
                        </FormControl>
                        <TextField
                            fullWidth
                            id={option._id}
                            placeholder="Option Text"
                            variant="outlined"
                            value={option.optionText}
                            onChange={handleOnChange}
                        />
                        {options.length > 1 ? (
                            <IconButton onClick={() => handleDeleteOption(option._id)}>
                                <XIcon />
                            </IconButton>
                        ) : null}
                    </Stack>
                </Grid>
            ))}
            <Grid item xs={12} key="new">
                <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl disabled>
                        <Radio />
                    </FormControl>
                    <Button variant="text" onClick={handleAddOption}>
                        Add Option
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
}

function MultipleChoiceCollapse(props) {
    const { id } = props;
    const options = useSelector((state) => state.form.form.questions.find((question) => question._id === id)?.options);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl disabled>
                        <RadioGroup name="multipleChoice">
                            {options.map((option) => (
                                <FormControlLabel
                                    key={option._id}
                                    value={option.optionText}
                                    control={<Radio />}
                                    label={<Typography>{option.optionText}</Typography>}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
        </>
    );
}

export default function MultipleChoice(props) {
    const { id, expand } = props;

    return <>{expand ? <MultipleChoiceExpand id={id} /> : <MultipleChoiceCollapse id={id} />}</>;
}

MultipleChoice.propTypes = {
    id: PropTypes.string,
    expand: PropTypes.bool,
};

MultipleChoiceExpand.propTypes = {
    id: PropTypes.string,
};

MultipleChoiceCollapse.propTypes = {
    id: PropTypes.string,
};
