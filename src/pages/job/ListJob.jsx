import {
    Card,
    Checkbox,
    Divider,
    IconButton,
    InputAdornment,
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
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Avatar,
} from '@mui/material';
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { useSelector } from 'react-redux';
import { Scrollbar } from '@components/scrollbar';
import { useGetPostingsByCompanyQuery } from '@features/job/jobApiSlice';
import { useNavigate } from 'react-router-dom';
import PATHS from '@constants/routes/paths';
import parse from 'html-react-parser';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useGetCompanyQuery } from '@features/company/companyApiSlice';

function duration(createdAt) {
    const now = dayjs();
    const created = dayjs(createdAt);
    const diff = now.diff(created, 'day');

    if (diff === 0) {
        //return > 1 minute ago

        const diff = now.diff(created, 'minute');
        if (diff < 5) {
            return 'just now';
        } else if (diff < 60) {
            return diff + ' minutes ago';
        } else {
            return 'today';
        }
    } else if (diff === 1) {
        return 'yesterday';
    } else if (diff < 7) {
        return diff + ' days ago';
    } else if (diff < 30) {
        return Math.floor(diff / 7) + ' weeks ago';
    } else if (diff < 365) {
        return Math.floor(diff / 30) + ' months ago';
    } else {
        return Math.floor(diff / 365) + ' years ago';
    }
}

function TablePostings() {
    const companyId = useSelector((state) => state.auth.user.company);
    const { data } = useGetPostingsByCompanyQuery(companyId);
    const { data: companyDetail } = useGetCompanyQuery(companyId);
    const navigate = useNavigate();

    const [open, setOpen] = useState('');

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
        {
            label: 'Last update (oldest)',
            value: 'updatedAt|asc',
        },
        {
            label: 'Total orders (highest)',
            value: 'orders|desc',
        },
        {
            label: 'Total orders (lowest)',
            value: 'orders|asc',
        },
    ];

    return (
        <>
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
                        placeholder="Search Job"
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
                                <TableCell>Application</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.map((posting) => {
                                return (
                                    <TableRow hover key={posting._id}>
                                        <TableCell padding="checkbox">
                                            <Checkbox />
                                        </TableCell>

                                        <TableCell>
                                            <Typography
                                                onClick={() => setOpen(posting._id)}
                                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                {posting.job?.title || 'None'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{posting.status || 'None'}</TableCell>
                                        <TableCell>
                                            <Typography
                                                onClick={() => {
                                                    if (posting.applications > 0) {
                                                        navigate(PATHS.APPLICATION.MANAGE.URL(posting._id));
                                                    }
                                                }}
                                                style={{
                                                    cursor: posting.applications > 0 ? 'pointer' : 'default',
                                                    textDecoration: posting.applications > 0 ? 'underline' : 'none',
                                                }}
                                            >
                                                {posting.applications > 0
                                                    ? posting.applications + ' Applications'
                                                    : 'None'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => navigate(PATHS.JOB.EDIT.URL(posting._id))}>
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
                    count={data?.employees ? data.employees.length : 0}
                    onPageChange={() => {}}
                    onRowsPerPageChange={() => {}}
                    page={0}
                    rowsPerPage={5}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Card>
            <Dialog onClose={() => setOpen('')} open={open !== ''} fullWidth>
                <DialogContent>
                    <Stack spacing={1}>
                        <Typography variant="h4">{data?.find((posting) => posting._id === open)?.job.title}</Typography>

                        <Stack direction="row" spacing={2}>
                            <Avatar
                                component={'a'}
                                href="#"
                                src={data?.find((posting) => posting._id === open)?.job.company?.logo}
                                variant="rounded"
                            />
                            <Stack>
                                <Typography variant="h6">{companyDetail?.company.name}</Typography>
                                <Typography variant="body2">
                                    {companyDetail?.company.address.state +
                                        ', ' +
                                        companyDetail?.company.address.country}
                                </Typography>
                            </Stack>
                        </Stack>

                        <Stack>
                            <Typography color="text.secondary" variant="caption">
                                {duration(data?.find((posting) => posting._id === open)?.createdAt)}
                            </Typography>

                            <Typography color="text.secondary" variant="caption">
                                {data?.find((posting) => posting._id === open)?.job.environment}
                                {' • '}
                                {data?.find((posting) => posting._id === open)?.job.employmentType[0].toUpperCase() +
                                    data?.find((posting) => posting._id === open)?.job.employmentType.slice(1)}
                                {' • '}
                                {data?.find((posting) => posting._id === open)?.salaryRange.min ===
                                data?.find((posting) => posting._id === open)?.salaryRange.max
                                    ? 'RM' + data?.find((posting) => posting._id === open)?.salaryRange.min
                                    : 'RM' +
                                      data?.find((posting) => posting._id === open)?.salaryRange.min +
                                      '- RM' +
                                      data?.find((posting) => posting._id === open)?.salaryRange.max}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack spacing={-0.2} sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">About the job</Typography>
                        {open !== '' && parse(data?.find((posting) => posting._id === open)?.description || '')}
                    </Stack>

                    <Stack spacing={-0.2} sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Qualification</Typography>
                        {(open !== '' && data?.find((posting) => posting._id === open)?.qualification) || ''}
                    </Stack>

                    {data?.find((posting) => posting._id === open)?.languages.length > 0 && (
                        <Stack spacing={-0.2} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">Languages</Typography>
                            {open !== '' &&
                                data
                                    ?.find((posting) => posting._id === open)
                                    ?.languages.map((language) => (
                                        <Typography key={language}>{language.name + ': ' + language.level}</Typography>
                                    ))}
                        </Stack>
                    )}

                    {data?.find((posting) => posting._id === open)?.technicalSkills.length > 0 && (
                        <Stack spacing={-0.2} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">Technical Skills</Typography>
                            {open !== '' &&
                                data
                                    ?.find((posting) => posting._id === open)
                                    ?.technicalSkills.map((skill) => (
                                        <Typography key={skill}>{skill.name + ': ' + skill.level}</Typography>
                                    ))}
                        </Stack>
                    )}

                    {data?.find((posting) => posting._id === open)?.softSkills.length > 0 && (
                        <Stack spacing={-0.2} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">Soft Skills</Typography>
                            {open !== '' &&
                                data
                                    ?.find((posting) => posting._id === open)
                                    ?.softSkills.map((skill) => <Typography key={skill}>{skill.name}</Typography>)}
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen('')} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

function ListJob() {
    return (
        <div>
            <h1>List Job</h1>
            <TablePostings />
        </div>
    );
}

export default ListJob;
