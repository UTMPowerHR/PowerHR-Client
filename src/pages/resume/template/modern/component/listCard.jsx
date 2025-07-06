import { useState } from 'react';
import propTypes from 'prop-types';
import {
    Box,
    Stack,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Chip,
} from '@mui/material';
import cloneDeep from 'lodash/cloneDeep';
import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { setResume } from '../../../../../features/applicant/applicantSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function ListCard(props) {
    const { item, column, page, disabled, cardList } = props;

    const titleColor = useSelector((state) => state.applicant.resume.template?.settings?.titleColor || '#000000');
    // const contentColor = useSelector((state) => state.applicant.resume.template?.settings?.contentColor || '#000000');
    const formData = useSelector((state) => state.applicant.resume);

    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [typeCard, setTypeCard] = useState(item.typeCard);

    const handleChangeCard = () => {
        let newItem = cloneDeep(item);
        newItem.typeCard = typeCard;
        let newData = cloneDeep(formData);
        const index = newData.template.pages[page].columns[column].list.findIndex((i) => i.name === item.name);
        newData.template.pages[page].columns[column].list[index] = newItem;
        dispatch(setResume(newData));
        setOpen(false);
    };

    const handleCancel = () => {
        setTypeCard(item.typeCard);
        setOpen(false);
    };

    function handleDelete() {
        let newData = cloneDeep(formData);
        const filter = newData.template.pages[page].columns[column].list.filter((i) => i.name !== item.name);
        newData.template.pages[page].columns[column].list = filter;
        dispatch(setResume(newData));
    }

    return (
        <>
            {/* technical skill */}
            <Stack spacing={2} sx={{ mb: 1 }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Typography variant="h5" id="title" sx={{ color: titleColor }}>
                        {formData[item.name].name}
                    </Typography>
                    {!disabled && (
                        <Stack direction="row" spacing={0} alignItems="center">
                            <IconButton size="small" color="primary" onClick={() => setOpen(true)}>
                                <ChangeCircleIcon />
                            </IconButton>

                            <IconButton onClick={handleDelete} size="small" color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Stack>
                    )}
                </Stack>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {formData[item.name].value.map((listItem, index) => (
                        <Chip
                            key={index}
                            label={listItem.name || listItem.skill || listItem}
                            sx={{
                                backgroundColor: titleColor,
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: titleColor,
                                    opacity: 0.8,
                                },
                            }}
                        />
                    ))}
                </Box>
            </Stack>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">Change card</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel id="demo-simple-select-label">Card</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={typeCard}
                            label="Card"
                            onChange={(e) => setTypeCard(e.target.value)}
                        >
                            {cardList
                                .find((i) => i.name === item.name)
                                ?.typeCard.map((i, index) => (
                                    <MenuItem key={index} value={i}>
                                        {i}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={handleChangeCard} autoFocus>
                        Change
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

ListCard.propTypes = {
    item: propTypes.object,
    column: propTypes.number,
    page: propTypes.number,
    disabled: propTypes.bool,
    cardList: propTypes.array,
};
