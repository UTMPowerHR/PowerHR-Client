import { Checkbox, FormControl, FormControlLabel, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function CheckBox(props) {
    const { indexFeedback, indexResponse } = props;
    const response = useSelector((state) => state.form.feedbacks?.feedbacks[indexFeedback]?.responses[indexResponse]);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl disabled>
                        {response.question.options.map((option, optIndex) => (
                            <FormControlLabel
                                key={option._id}
                                value={optIndex}
                                checked={response.answers.some((answer) => answer.optionIndex === optIndex)}
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
    indexFeedback: PropTypes.number.isRequired,
    indexResponse: PropTypes.number.isRequired,
};
