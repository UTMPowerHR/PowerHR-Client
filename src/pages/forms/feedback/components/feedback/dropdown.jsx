import { FormControl, Grid, MenuItem, Select } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function DropDown(props) {
    const { indexFeedback, indexResponse } = props;
    const response = useSelector((state) => state.form.feedbacks?.feedbacks[indexFeedback]?.responses[indexResponse]);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item md={5} xs={12}>
                    <FormControl sx={{ width: '100%' }} disabled>
                        <Select
                            inputProps={{ 'aria-label': 'Without label' }}
                            value={response?.answers[0]?.optionIndex ? response?.answers[0]?.optionIndex : 0}
                            sx={{ width: '100%' }}
                        >
                            <MenuItem value={0}>
                                <em>Select</em>
                            </MenuItem>
                            {response.question.options?.map((option, optIndex) => (
                                <MenuItem key={option._id} value={optIndex + 1}>
                                    {option.optionText}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </>
    );
}

DropDown.propTypes = {
    indexFeedback: PropTypes.number.isRequired,
    indexResponse: PropTypes.number.isRequired,
};
