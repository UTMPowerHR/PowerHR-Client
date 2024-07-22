import { Grid, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

function Paragraph(props) {
    const { indexFeedback, indexResponse } = props;
    const response = useSelector((state) => state.form.feedbacks?.feedbacks[indexFeedback]?.responses[indexResponse]);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        variant="standard"
                        placeholder="Your answer"
                        fullWidth
                        value={response?.answers[0]?.text ? response?.answers[0]?.text : ''}
                        multiline
                        disabled
                    />
                </Grid>
            </Grid>
        </>
    );
}

Paragraph.propTypes = {
    indexFeedback: PropTypes.number.isRequired,
    indexResponse: PropTypes.number.isRequired,
};

export default Paragraph;
