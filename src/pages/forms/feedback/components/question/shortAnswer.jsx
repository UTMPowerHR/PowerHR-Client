import { Grid, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setAnswer } from '@features/form/formSlice';

function ShortAnswer(props) {
    const { index } = props;
    const response = useSelector((state) => state.form.feedback.responses[index]);
    const dispatch = useDispatch();

    const handleChange = (event) => {
        dispatch(
            setAnswer({
                index,
                answers: [
                    {
                        text: event.target.value,
                    },
                ],
            }),
        );
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                    <TextField
                        variant="standard"
                        placeholder="Your answer"
                        fullWidth
                        onChange={handleChange}
                        value={response?.answers[0]?.text ? response?.answers[0]?.text : ''}
                    />
                </Grid>
            </Grid>
        </>
    );
}

ShortAnswer.propTypes = {
    index: PropTypes.number,
};

export default ShortAnswer;
