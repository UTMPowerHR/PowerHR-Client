import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function MultipleChoice(props) {
    const { indexFeedback, indexResponse } = props;
    const response = useSelector((state) => state.form.feedbacks?.feedbacks[indexFeedback]?.responses[indexResponse]);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl disabled>
                        <RadioGroup
                            name="multipleChoice"
                            value={response?.answers[0]?.optionIndex ? response?.answers[0]?.optionIndex : ''}
                            disabled
                        >
                            {response.question.options.map((option, index) => (
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
    indexFeedback: PropTypes.number.isRequired,
    indexResponse: PropTypes.number.isRequired,
};
