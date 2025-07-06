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
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { cloneDeep } from 'lodash';
import { setResume } from '../../../../../features/applicant/applicantSlice';

export default function TimelineCard(props) {
    const { item, column, page, disabled, cardList } = props;

    const titleColor = useSelector((state) => state.applicant.resume.template?.settings?.titleColor || '#000000');
    const contentColor = useSelector((state) => state.applicant.resume.template?.settings?.contentColor || '#000000');
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
            <Stack spacing={1}>
                <Stack spacing={-0.5}>
                    <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                        <Typography variant="h5" id="Title" sx={{ color: titleColor }}>
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
                    <Divider sx={{ my: 1, borderColor: '#000000' }} />
                </Stack>

                {formData[item.name].value.map((i, index) => (
                    <Box key={index}>
                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                            <Typography variant="h6" sx={{ color: contentColor }}>
                                {i?.company || i?.name || i?.institution}
                            </Typography>
                            <Typography variant="h6" id="content" sx={{ color: contentColor }}>
                                {i.date.from} {i.date.to ? ` - ${i.date.to}` : ''}
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                            <Typography variant="body1" id="content" sx={{ color: contentColor }}>
                                {i?.title || i?.degree}
                            </Typography>
                            <Typography variant="body1" id="content" sx={{ color: contentColor }}>
                                {i?.location || i?.from}
                            </Typography>
                        </Stack>

                        <List dense sx={{ mt: -1 }}>
                            {i?.description?.map((j, index) => (
                                <ListItem key={index} disablePadding>
                                    <ListItemIcon>
                                        <Typography variant="body1" id="content" sx={{ color: contentColor }}>
                                            •
                                        </Typography>
                                    </ListItemIcon>
                                    <ListItemText primary={j} sx={{ color: contentColor }} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                ))}
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

TimelineCard.propTypes = {
    item: propTypes.object,
    column: propTypes.number,
    page: propTypes.number,
    disabled: propTypes.bool,
    cardList: propTypes.array,
};
