import { FormControl, Grid, MenuItem, Select } from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setAnswer } from '@features/form/formSlice';

export default function DropDown(props) {
    const { id, index } = props;
    const options = useSelector((state) => state.form.form.questions.find((question) => question._id === id)?.options);
    const response = useSelector((state) => state.form.feedback.responses[index]);
    const dispatch = useDispatch();

    const handleChange = (event) => {
        if (event.target.value === 0) {
            dispatch(
                setAnswer({
                    index,
                    answers: [],
                }),
            );
            return;
        }

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
                <Grid item md={5} xs={12}>
                    <FormControl sx={{ width: '100%' }}>
                        <Select
                            inputProps={{ 'aria-label': 'Without label' }}
                            value={response?.answers[0]?.optionIndex ? response?.answers[0]?.optionIndex : 0}
                            onChange={handleChange}
                            sx={{ width: '100%' }}
                        >
                            <MenuItem value={0}>
                                <em>Select</em>
                            </MenuItem>
                            {options?.map((option, optIndex) => (
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
    id: PropTypes.string,
    index: PropTypes.number,
};
