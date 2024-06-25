import { FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useEffect, useState, useCallback, useMemo } from 'react';

function LinearScale(props) {
    const { indexFeedback, indexResponse } = props;
    const response = useSelector((state) => state.form.feedbacks?.feedbacks[indexFeedback]?.responses[indexResponse]);

    const [scale, setScale] = useState([]);

    const generateScale = useCallback((options) => {
        if (options.length === 0) {
            return [];
        } else {
            let newScale = [];
            for (let i = options[0].optionScale; i <= options[1].optionScale; i++) {
                newScale.push(i);
            }
            return newScale;
        }
    }, []);

    const memoizedScale = useMemo(
        () => generateScale(response.question.options),
        [generateScale, response.question.options],
    );

    useEffect(() => {
        setScale(memoizedScale);
    }, [memoizedScale]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                    <Typography variant="subtitle1">{response.question.options[0]?.optionText}</Typography>
                    <FormControl>
                        <RadioGroup
                            row
                            aria-labelledby="demo-form-control-label-placement"
                            name="position"
                            value={response?.answers[0]?.optionIndex ? response?.answers[0]?.optionIndex : ''}
                        >
                            {scale?.map((option) => (
                                <FormControlLabel
                                    key={option}
                                    value={option}
                                    control={<Radio />}
                                    label={<Typography>{option}</Typography>}
                                    labelPlacement="top"
                                    disabled
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <Typography variant="subtitle1">{response.question.options[1]?.optionText}</Typography>
                </Stack>
            </Grid>
        </Grid>
    );
}

LinearScale.propTypes = {
    indexFeedback: PropTypes.number.isRequired,
    indexResponse: PropTypes.number.isRequired,
};

export default LinearScale;
