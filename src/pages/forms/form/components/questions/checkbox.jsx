import {
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    Stack,
    TextField,
    Typography,
    Checkbox,
} from '@mui/material';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { addOption, deleteOption, setOption } from '../../../../../features/form/formSlice';

function CheckBoxExpand(props) {
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
            {options?.map((option) => (
                <Grid item xs={12} key={option._id}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormControl disabled>
                            <Checkbox />
                        </FormControl>
                        <TextField
                            fullWidth
                            id={option._id}
                            placeholder="Option Text"
                            variant="outlined"
                            value={option.optionText}
                            onChange={handleOnChange}
                        />
                        {options?.length > 1 ? (
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
                        <Checkbox />
                    </FormControl>
                    <Button variant="text" onClick={handleAddOption}>
                        Add Option
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
}

function CheckBoxCollapse(props) {
    const { id } = props;
    const options = useSelector((state) => state.form.form.questions.find((question) => question._id === id)?.options);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl disabled>
                        {options?.map((option) => (
                            <FormControlLabel
                                key={option._id}
                                value={option.optionText}
                                control={<Checkbox />}
                                label={<Typography>{option.optionText}</Typography>}
                            />
                        ))}
                    </FormControl>
                </Grid>
            </Grid>
        </>
    );
}

export default function CheckBox(props) {
    const { id, expand } = props;

    return <>{expand ? <CheckBoxExpand id={id} /> : <CheckBoxCollapse id={id} />}</>;
}

CheckBox.propTypes = {
    id: PropTypes.string,
    expand: PropTypes.bool,
};

CheckBoxExpand.propTypes = {
    id: PropTypes.string,
};

CheckBoxCollapse.propTypes = {
    id: PropTypes.string,
};
