import { Checkbox, FormControl, FormControlLabel, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setAnswer } from '@features/form/formSlice';

export default function CheckBox(props) {
    const { id, index } = props;
    const options = useSelector((state) => state.form.form.questions.find((question) => question._id === id)?.options);
    const answers = useSelector((state) => state.form.feedback.responses[index].answers);
    const dispatch = useDispatch();

    const handleChange = (event) => {
        // If  checkbox is checked, add optionIndex to answers
        if (event.target.checked) {
            dispatch(
                setAnswer({
                    index,
                    answers: [
                        ...answers,
                        {
                            optionIndex: parseInt(event.target.value),
                        },
                    ],
                }),
            );
        } else {
            // If checkbox is unchecked, remove optionIndex from answers
            dispatch(
                setAnswer({
                    index,
                    answers: answers.filter((answer) => answer.optionIndex !== parseInt(event.target.value)),
                }),
            );
        }
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl>
                        {options.map((option, optIndex) => (
                            <FormControlLabel
                                key={option._id}
                                value={optIndex}
                                checked={answers.some((answer) => answer.optionIndex === optIndex)}
                                onChange={handleChange}
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

CheckBox.propTypes = {
    id: PropTypes.string,
    index: PropTypes.number,
};
