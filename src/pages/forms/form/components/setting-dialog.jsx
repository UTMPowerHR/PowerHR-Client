import { Box, Button, Dialog, Grid, Paper, Stack, Switch, Typography, IconButton, SvgIcon } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setSetting } from '../../../../features/form/formSlice';
import XIcon from '@untitled-ui/icons-react/build/esm/X';

function SettingDialog(props) {
    const { onSettingClose, openSetting = false } = props;
    const form = useSelector((state) => state.form.form);
    const dispatch = useDispatch();

    const handleChange = (event) => {
        const tempForm = { ...form };
        tempForm.setting = { ...tempForm.setting };

        if (event.target.name === 'dueDate') {
            tempForm.setting.dueDate = { ...tempForm.setting.dueDate };
            tempForm.setting.dueDate.active = !tempForm.setting.dueDate.active;
            tempForm.setting.dueDate.date = tempForm.setting.dueDate.date
                ? tempForm.setting.dueDate.date
                : dayjs().add(1, 'day').toString();
        } else if (event.target.name === 'requiredAll') {
            tempForm.setting.requiredAll = !tempForm.setting.requiredAll;
            if (tempForm.setting.requiredAll) {
                tempForm.questions = tempForm.questions.map((question) => {
                    return { ...question, required: true, snapshot: { ...question.snapshot, setting: true } };
                });
            }
        } else {
            tempForm.setting[event.target.name] = !tempForm.setting[event.target.name];
        }

        dispatch(setSetting(tempForm));
    };

    const handleDateChange = (date) => {
        const tempForm = { ...form };
        tempForm.setting = { ...tempForm.setting };
        tempForm.setting.dueDate = { ...tempForm.setting.dueDate };
        tempForm.setting.dueDate.date = date.toString();

        dispatch(setSetting(tempForm));
    };

    return (
        <Dialog fullWidth maxWidth="md" onClose={onSettingClose} open={openSetting}>
            <Paper elevation={12}>
                <Grid container spacing={2} sx={{ p: 3 }}>
                    <Grid item xs={12}>
                        <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={3} sx={{}}>
                            <Typography variant="h5">Setting</Typography>
                            <IconButton color="inherit" onClick={onSettingClose}>
                                <SvgIcon>
                                    <XIcon />
                                </SvgIcon>
                            </IconButton>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ pb: 4, borderBottom: 1 }}>
                            <Typography variant="h6">Form</Typography>
                            <Typography variant="h7">Manage form setting</Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    pl: 4,
                                    pt: 2,
                                }}
                            >
                                <Box>
                                    <Typography variant="h6">Collaborators</Typography>
                                    <Typography variant="h7">Add others people to edit this form</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 4, pt: 2 }}>
                                <Box>
                                    <Typography variant="h6">Publish</Typography>
                                    <Typography variant="h7">Make sure the form are ready to published</Typography>
                                </Box>
                                <Box>
                                    <Switch
                                        checked={form.setting?.published}
                                        name="published"
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ pb: 4, borderBottom: 1 }}>
                            <Typography variant="h6">Responses</Typography>
                            <Typography variant="h7">Manage how responses are collected</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 4, pt: 2 }}>
                                <Box>
                                    <Typography variant="h6">Limit to 1 response</Typography>
                                </Box>
                                <Box>
                                    <Switch checked={form.setting?.once} name="once" onChange={handleChange} />
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 4, pt: 2 }}>
                                <Box>
                                    <Typography variant="h6">Accepting responses</Typography>
                                    <Typography variant="h7">
                                        This will turn {!form.setting?.published ? 'on' : 'off'} publish
                                    </Typography>
                                </Box>
                                <Box>
                                    <Switch
                                        checked={form.setting?.published}
                                        name="published"
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Box>
                            {form.setting?.published ? (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 4, pt: 2 }}>
                                    <Stack spacing={1}>
                                        <Typography variant="h6">Accepting responses until</Typography>
                                        {form.setting?.dueDate.active ? (
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DateTimePicker
                                                    value={dayjs(form.setting?.dueDate.date)}
                                                    onChange={handleDateChange}
                                                    slotProps={{ textField: { variant: 'outlined' } }}
                                                />
                                            </LocalizationProvider>
                                        ) : (
                                            ''
                                        )}
                                    </Stack>
                                    <Box>
                                        <Switch
                                            checked={form.setting?.dueDate.active}
                                            name="dueDate"
                                            onChange={handleChange}
                                        />
                                    </Box>
                                </Box>
                            ) : (
                                ''
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box>
                            <Typography variant="h6">Question defaults</Typography>
                            <Typography variant="h7">Settings applied to all new questions</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 4, pt: 2 }}>
                                <Box>
                                    <Typography variant="h6">Make questions required by default</Typography>
                                </Box>
                                <Box>
                                    <Switch
                                        checked={form.setting?.requiredAll}
                                        name="requiredAll"
                                        onChange={handleChange}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent="flex-end" spacing={2}>
                            <Button onClick={onSettingClose} variant="contained">
                                Close
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
        </Dialog>
    );
}

SettingDialog.propTypes = {
    onSettingClose: PropTypes.func,
    openSetting: PropTypes.bool,
};

export default SettingDialog;
