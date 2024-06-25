import { Grid, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

function ShortAnswer(props) {
    const { indexFeedback, indexResponse } = props;
    const response = useSelector((state) => state.form.feedbacks?.feedbacks[indexFeedback]?.responses[indexResponse]);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                    <TextField
                        variant="standard"
                        placeholder="Your answer"
                        fullWidth
                        disabled
                        value={response?.answers[0]?.text ? response?.answers[0]?.text : ''}
                    />
                </Grid>
            </Grid>
        </>
    );
}

ShortAnswer.propTypes = {
    indexFeedback: PropTypes.number.isRequired,
    indexResponse: PropTypes.number.isRequired,
};

export default ShortAnswer;
