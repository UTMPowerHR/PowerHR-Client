import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setAnswer } from '@features/form/formSlice';

export default function MultipleChoice(props) {
    const { id, index } = props;
    const options = useSelector((state) => state.form.form.questions.find((question) => question._id === id)?.options);
    const response = useSelector((state) => state.form.feedback.responses[index]);
    const dispatch = useDispatch();

    const handleChange = (event) => {
        dispatch(
            setAnswer({
                index,
                answers: [
                    {
                        optionIndex: parseInt(event.target.value),
                    },
                ],
            }),
        );
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl>
                        <RadioGroup
                            name="multipleChoice"
                            value={response?.answers[0]?.optionIndex ? response?.answers[0]?.optionIndex : ''}
                            onChange={handleChange}
                        >
                            {options.map((option, index) => (
                                <FormControlLabel
                                    key={option._id}
                                    value={index + 1}
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

MultipleChoice.propTypes = {
    id: PropTypes.string,
    index: PropTypes.number,
};
