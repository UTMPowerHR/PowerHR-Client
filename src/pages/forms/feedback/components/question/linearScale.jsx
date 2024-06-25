import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAnswer } from '@features/form/formSlice';
import PropTypes from 'prop-types';

function LinearScale(props) {
    const { id, index } = props;
    const options = useSelector((state) => state.form.form.questions.find((question) => question._id === id)?.options);
    const response = useSelector((state) => state.form.feedback.responses[index]);
    const dispatch = useDispatch();
    const [scale, setScale] = useState([]);

    useEffect(() => {
        if (options.length === 0) {
            setScale([]);
        } else {
            let newScale = [];
            for (let i = options[0].optionScale; i <= options[1].optionScale; i++) {
                newScale.push(i);
            }
            setScale(newScale);
        }
    }, [options]);

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
        <Grid container spacing={2}>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                    <Typography variant="subtitle1">{options[0]?.optionText}</Typography>
                    <FormControl>
                        <RadioGroup
                            row
                            aria-labelledby="demo-form-control-label-placement"
                            name="position"
                            value={response?.answers[0]?.optionIndex ? response?.answers[0]?.optionIndex : ''}
                            onChange={handleChange}
                        >
                            {scale?.map((option) => (
                                <FormControlLabel
                                    key={option}
                                    value={option}
                                    control={<Radio />}
                                    label={<Typography>{option}</Typography>}
                                    labelPlacement="top"
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <Typography variant="subtitle1">{options[1]?.optionText}</Typography>
                </Stack>
            </Grid>
        </Grid>
    );
}

LinearScale.propTypes = {
    id: PropTypes.string,
    index: PropTypes.number,
};

export default LinearScale;
