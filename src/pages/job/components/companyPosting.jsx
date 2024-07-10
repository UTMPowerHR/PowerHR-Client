import { Button, Card, Divider, Stack, Typography, Dialog, DialogActions, DialogContent, Avatar } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useCreateApplicationMutation } from '@features/job/jobApiSlice';
import { useState } from 'react';
import parse from 'html-react-parser';

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

export default function CompanyPosting(props) {
    const { index } = props;
    const postings = useSelector((state) => state.job.companies[index]?.postings);
    const listIdPosting = useSelector((state) => state.job?.postings);
    const userId = useSelector((state) => state.auth.user._id);

    const [createApplicationMutation] = useCreateApplicationMutation();

    const [open, setOpen] = useState('');
    const [openApply, setOpenApply] = useState('');

    async function handleApply(id) {
        const data = {
            postingId: id,
            applicantId: userId,
        };

        await createApplicationMutation(data);
    }

    async function openJobDescription(id) {
        setOpen(id);
    }

    function openPopUpApply(id) {
        setOpenApply(id);
    }

    return (
        <>
            <Card variant="outlined">
                <Stack divider={<Divider />}>
                    {postings?.map((posting) => {
                        return (
                            <Stack
                                alignItems="center"
                                direction="row"
                                flexWrap="wrap"
                                justifyContent="space-between"
                                key={posting._id}
                                sx={{
                                    px: 2,
                                    py: 1.5,
                                }}
                            >
                                <Stack>
                                    <Typography
                                        onClick={() => openJobDescription(posting._id)}
                                        variant="subtitle1"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {posting.job.title}
                                    </Typography>
                                    <Typography color="text.secondary" variant="caption">
                                        {posting.job.environment}
                                        {' • '}
                                        {posting.job.employmentType[0].toUpperCase() +
                                            posting.job.employmentType.slice(1)}
                                        {' • '}
                                        {posting.salaryRange.min === posting.salaryRange.max
                                            ? 'RM' + posting.salaryRange.min
                                            : 'RM' + posting.salaryRange.min + '- RM' + posting.salaryRange.max}
                                    </Typography>
                                </Stack>

                                <Stack alignItems="center" direction="row" spacing={2}>
                                    <Typography color="text.secondary" variant="caption">
                                        {duration(posting.createdAt)}
                                    </Typography>
                                    <Button
                                        size="small"
                                        disabled={listIdPosting?.includes(posting._id)}
                                        onClick={() => {
                                            setOpen(posting._id);
                                            openPopUpApply(posting._id);
                                        }}
                                    >
                                        Apply
                                    </Button>
                                </Stack>
                            </Stack>
                        );
                    })}
                </Stack>
            </Card>

            <Dialog
                onClose={() => {
                    setOpenApply('');
                    setOpen('');
                }}
                open={open}
                fullWidth
            >
                <DialogContent>
                    <Stack spacing={1}>
                        <Typography variant="h4">
                            {postings?.find((posting) => posting._id === open)?.job.title}
                        </Typography>

                        <Stack direction="row" spacing={2}>
                            <Avatar
                                component={'a'}
                                href="#"
                                src={postings?.find((posting) => posting._id === open)?.job.company?.logo}
                                variant="rounded"
                            />
                            <Stack>
                                <Typography variant="h6">
                                    {postings?.find((posting) => posting._id === open)?.job.company.name}
                                </Typography>
                                <Typography variant="body2">
                                    {postings?.find((posting) => posting._id === open)?.job.company.address.state +
                                        ', ' +
                                        postings?.find((posting) => posting._id === open)?.job.company.address.country}
                                </Typography>
                            </Stack>
                        </Stack>

                        <Stack>
                            <Typography color="text.secondary" variant="caption">
                                {duration(postings?.find((posting) => posting._id === open)?.createdAt)}
                            </Typography>

                            <Typography color="text.secondary" variant="caption">
                                {postings?.find((posting) => posting._id === open)?.job.environment}
                                {' • '}
                                {postings
                                    ?.find((posting) => posting._id === open)
                                    ?.job.employmentType[0].toUpperCase() +
                                    postings?.find((posting) => posting._id === open)?.job.employmentType.slice(1)}
                                {' • '}
                                {postings?.find((posting) => posting._id === open)?.salaryRange.min ===
                                postings?.find((posting) => posting._id === open)?.salaryRange.max
                                    ? 'RM' + postings?.find((posting) => posting._id === open)?.salaryRange.min
                                    : 'RM' +
                                      postings?.find((posting) => posting._id === open)?.salaryRange.min +
                                      '- RM' +
                                      postings?.find((posting) => posting._id === open)?.salaryRange.max}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack spacing={-0.2} sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">About the job</Typography>
                        {open !== '' && parse(postings?.find((posting) => posting._id === open)?.description || '')}
                    </Stack>

                    <Stack spacing={-0.2} sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Qualification</Typography>
                        {(open !== '' && postings?.find((posting) => posting._id === open)?.qualification) || ''}
                    </Stack>

                    {postings?.find((posting) => posting._id === open)?.languages.length > 0 && (
                        <Stack spacing={-0.2} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">Languages</Typography>
                            {open !== '' &&
                                postings
                                    ?.find((posting) => posting._id === open)
                                    ?.languages.map((language) => (
                                        <Typography key={language}>{language.name + ': ' + language.level}</Typography>
                                    ))}
                        </Stack>
                    )}

                    {postings?.find((posting) => posting._id === open)?.technicalSkills.length > 0 && (
                        <Stack spacing={-0.2} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">Technical Skills</Typography>
                            {open !== '' &&
                                postings
                                    ?.find((posting) => posting._id === open)
                                    ?.technicalSkills.map((skill) => (
                                        <Typography key={skill}>{skill.name + ': ' + skill.level}</Typography>
                                    ))}
                        </Stack>
                    )}

                    {postings?.find((posting) => posting._id === open)?.softSkills.length > 0 && (
                        <Stack spacing={-0.2} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">Soft Skills</Typography>
                            {open !== '' &&
                                postings
                                    ?.find((posting) => posting._id === open)
                                    ?.softSkills.map((skill) => <Typography key={skill}>{skill.name}</Typography>)}
                        </Stack>
                    )}

                    {openApply !== '' && (
                        <Button
                            sx={{ mt: 2 }}
                            onClick={() => {
                                handleApply(openApply);
                                setOpen('');
                                setOpenApply('');
                            }}
                            variant="contained"
                            fullWidth
                        >
                            Apply
                        </Button>
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

CompanyPosting.propTypes = {
    index: PropTypes.number.isRequired,
};
