import {
    Card,
    Checkbox,
    Divider,
    IconButton,
    InputAdornment,
    Link,
    OutlinedInput,
    Stack,
    SvgIcon,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Scrollbar } from '@components/scrollbar';
import PATHS from '@constants/routes/paths';
import { useGetAllPublishFormsByCompanyQuery } from '@features/form/formApiSlice';
import { setForms } from '@features/form/formSlice';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

function TablePublishForm() {
    const user = useSelector((state) => state.auth.user);
    const forms = useSelector((state) => state.form.forms);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data, isSuccess } = useGetAllPublishFormsByCompanyQuery({ companyId: user.company, userId: user._id });

    useEffect(() => {
        if (isSuccess) {
            dispatch(setForms(data.forms));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, isSuccess]);

    const tabs = [
        {
            label: 'All',
            value: 'all',
        },
    ];

    const sortOptions = [
        {
            label: 'Last update (newest)',
            value: 'updatedAt|desc',
        },
    ];

    return (
        <Card>
            <Tabs
                indicatorColor="primary"
                scrollButtons="auto"
                textColor="primary"
                value="all"
                sx={{ px: 3 }}
                variant="scrollable"
            >
                {tabs.map((tab) => (
                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
            </Tabs>
            <Divider />
            <Stack alignItems="center" direction="row" flexWrap="wrap" gap={2} sx={{ p: 3 }}>
                <OutlinedInput
                    placeholder="Search Form"
                    startAdornment={
                        <InputAdornment position="start">
                            <SvgIcon>
                                <SearchMdIcon />
                            </SvgIcon>
                        </InputAdornment>
                    }
                    sx={{ flexGrow: 1 }}
                />
                <TextField label="Sort By" name="sort" select SelectProps={{ native: true }}>
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField>
            </Stack>
            <Scrollbar>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox />
                            </TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {forms?.map((form) => {
                            return (
                                <TableRow hover key={form._id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell>
                                        <Stack alignItems="center" direction="row" spacing={1}>
                                            <div>
                                                <Link color="inherit" variant="subtitle2">
                                                    {form.name}
                                                </Link>
                                                <Typography color="text.secondary" variant="body2">
                                                    {form.description}
                                                </Typography>
                                            </div>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>{form.done ? 'Answered' : 'New'}</TableCell>
                                    <TableCell>
                                        {form.setting.dueDate.active
                                            ? dayjs(form.setting.dueDate.date).utc(true).format('DD/MM/YYYY hh:mm A')
                                            : 'No due date'}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={() => navigate(PATHS.FORM.INDEX + '/' + form._id + '/answer')}
                                            disabled={
                                                (form.setting.once && form.done) ||
                                                (form.setting.dueDate.active &&
                                                    dayjs(form.setting.dueDate.date).isBefore(dayjs()))
                                            }
                                        >
                                            <SvgIcon>
                                                <Edit02Icon />
                                            </SvgIcon>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Scrollbar>
            <TablePagination
                component="div"
                count={forms ? forms.length : 0}
                onPageChange={() => {}}
                onRowsPerPageChange={() => {}}
                page={0}
                rowsPerPage={5}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Card>
    );
}

export default TablePublishForm;
