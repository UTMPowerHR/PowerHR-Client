import {
    Grid,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Stack,
    Select,
    MenuItem,
    TextField,
    Box,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setOption } from '../../../../../features/form/formSlice';

function LinearScaleExpand(props) {
    const { id } = props;
    const options = useSelector((state) => state.form.form.questions.find((question) => question._id === id)?.options);

    const dispatch = useDispatch();

    const handleScaleChange = (index, value) => {
        let newOption = { ...options[index] };
        newOption.optionScale = value;

        dispatch(setOption({ questionId: id, option: newOption }));
    };

    const handleTextChange = (index, value) => {
        let newOption = { ...options[index] };
        newOption.optionText = value;

        dispatch(setOption({ questionId: id, option: newOption }));
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl>
                        <Select
                            value={options[0].optionScale}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            onChange={(e) => handleScaleChange(0, e.target.value)}
                        >
                            <MenuItem value={0}>0</MenuItem>
                            <MenuItem value={1}>1</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography variant="subtitle1">to</Typography>
                    <FormControl>
                        <Select
                            value={options[1].optionScale}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            onChange={(e) => handleScaleChange(1, e.target.value)}
                        >
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={7}>7</MenuItem>
                            <MenuItem value={8}>8</MenuItem>
                            <MenuItem value={9}>9</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Grid>
            <Grid item md={6} xs={12}>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                        <Box sx={{ minWidth: 20, textAlign: 'center' }}>
                            <Typography variant="subtitle1">{options[0]?.optionScale}</Typography>
                        </Box>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Label (optional)"
                            value={options[0]?.optionText ? options[0]?.optionText : ''}
                            onChange={(e) => handleTextChange(0, e.target.value)}
                        />
                    </Stack>
                    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                        <Box sx={{ minWidth: 20, textAlign: 'center' }}>
                            <Typography variant="subtitle1">{options[1]?.optionScale}</Typography>
                        </Box>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Label (optional)"
                            value={options[1]?.optionText ? options[1]?.optionText : ''}
                            onChange={(e) => handleTextChange(1, e.target.value)}
                        />
                    </Stack>
                </Stack>
            </Grid>
        </Grid>
    );
}

function LinearScaleCollapse(props) {
    const { id } = props;
    const options = useSelector((state) => state.form.form.questions.find((question) => question._id === id)?.options);
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

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                    <Typography variant="subtitle1">{options[0]?.optionText}</Typography>
                    <FormControl disabled>
                        <RadioGroup row aria-labelledby="demo-form-control-label-placement" name="position">
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

export default function LinearScale(props) {
    const { id, expand } = props;

    return <>{expand ? <LinearScaleExpand id={id} /> : <LinearScaleCollapse id={id} />}</>;
}

LinearScale.propTypes = {
    id: PropTypes.string,
    expand: PropTypes.bool,
};

LinearScaleExpand.propTypes = {
    id: PropTypes.string,
};

LinearScaleCollapse.propTypes = {
    id: PropTypes.string,
};
