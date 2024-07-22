import { Box, Button, Grid, IconButton, Stack, TextField, Typography } from '@mui/material';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { addOption, deleteOption, setOption } from '../../../../../features/form/formSlice';

function DropDownExpand(props) {
    const { id } = props;
    const options = useSelector((state) => state.form.form.questions.find((question) => question._id === id)?.options);

    const dispatch = useDispatch();

    const handleAddOption = () => {
        const newOption = {
            _id: 'new' + crypto.randomUUID(),
            optionText: 'Option ' + (options.length + 1),
        };

        dispatch(addOption({ questionId: id, option: newOption }));
    };

    const handleDeleteOption = (optionId) => {
        dispatch(deleteOption({ questionId: id, optionId }));
    };

    const handleOnChange = (e) => {
        const option = options.find((option) => option._id === e.target.id);
        let newOption = { ...option };
        newOption.optionText = e.target.value;

        dispatch(setOption({ questionId: id, option: newOption }));
    };

    return (
        <Grid container spacing={2}>
            {options?.map((option, index) => (
                <Grid item xs={12} key={option._id}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ minWidth: 20, textAlign: 'center' }}>
                            <Typography variant="subtitle1">{index + 1}.</Typography>
                        </Box>
                        <TextField
                            fullWidth
                            id={option._id}
                            placeholder="Option Text"
                            variant="outlined"
                            value={option.optionText}
                            onChange={handleOnChange}
                        />
                        {options?.length > 1 ? (
                            <IconButton onClick={() => handleDeleteOption(option._id)}>
                                <XIcon />
                            </IconButton>
                        ) : null}
                    </Stack>
                </Grid>
            ))}
            <Grid item xs={12} key="new">
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ minWidth: 20, textAlign: 'center' }}>
                        <Typography variant="subtitle1">{options.length + 1}.</Typography>
                    </Box>
                    <Button variant="text" onClick={handleAddOption}>
                        Add Option
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
}

function DropDownCollapse(props) {
    const { id } = props;
    const options = useSelector((state) => state.form.form.questions.find((question) => question._id === id)?.options);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {options?.map((option, index) => (
                        <Stack direction="row" spacing={2} alignItems="center" key={option._id}>
                            <Box sx={{ minWidth: 20, textAlign: 'center' }}>
                                <Typography variant="subtitle1">{index + 1}.</Typography>
                            </Box>
                            <Typography variant="subtitle1">{option.optionText}</Typography>
                        </Stack>
                    ))}
                </Grid>
            </Grid>
        </>
    );
}

export default function DropDown(props) {
    const { id, expand } = props;

    return <>{expand ? <DropDownExpand id={id} /> : <DropDownCollapse id={id} />}</>;
}

DropDown.propTypes = {
    id: PropTypes.string,
    expand: PropTypes.bool,
};

DropDownExpand.propTypes = {
    id: PropTypes.string,
};

DropDownCollapse.propTypes = {
    id: PropTypes.string,
};
