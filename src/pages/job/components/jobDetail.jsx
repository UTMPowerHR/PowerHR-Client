import { Button, Chip, InputAdornment, Stack, SvgIcon, TextField, Typography } from '@mui/material';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCreate } from '@features/job/jobSlice';

export default function JobDetails(props) {
    const { onBack, onNext, ...other } = props;
    const [tag, setTag] = useState('');
    const tags = useSelector((state) => state.job.create.tags);
    const title = useSelector((state) => state.job.create.title);
    const dispatch = useDispatch();

    const handleTagAdd = (tag) => {
        dispatch(setCreate({ name: 'tags', value: [...tags, tag] }));
    };

    const handleTagDelete = (tag) => {
        dispatch(setCreate({ name: 'tags', value: tags.filter((t) => t !== tag) }));
    };

    const handleTitleChange = (event) => {
        dispatch(setCreate({ name: 'title', value: event.target.value }));
    };

    return (
        <Stack spacing={3} {...other}>
            <div>
                <Typography variant="h6">What is the job about?</Typography>
            </div>
            <Stack spacing={3}>
                <TextField
                    fullWidth
                    label="Job Title"
                    name="jobTitle"
                    placeholder="e.g Salesforce Analyst"
                    onChange={handleTitleChange}
                    value={title}
                />
                <TextField
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button
                                    color="inherit"
                                    sx={{ ml: 2 }}
                                    onClick={() => {
                                        if (!tag) {
                                            return;
                                        }

                                        handleTagAdd(tag);
                                        setTag('');
                                    }}
                                >
                                    Add
                                </Button>
                            </InputAdornment>
                        ),
                    }}
                    label="Tags"
                    name="tags"
                    onChange={(event) => setTag(event.target.value)}
                    value={tag}
                />
                <Stack alignItems="center" direction="row" flexWrap="wrap" spacing={1}>
                    {tags.map((tag, index) => (
                        <Chip key={index} label={tag} onDelete={() => handleTagDelete(tag)} variant="outlined" />
                    ))}
                </Stack>
            </Stack>
            <Stack alignItems="center" direction="row" spacing={2}>
                <Button
                    endIcon={
                        <SvgIcon>
                            <ArrowRightIcon />
                        </SvgIcon>
                    }
                    onClick={onNext}
                    variant="contained"
                >
                    Continue
                </Button>
                <Button color="inherit" onClick={onBack}>
                    Back
                </Button>
            </Stack>
        </Stack>
    );
}

JobDetails.propTypes = {
    onBack: PropTypes.func,
    onNext: PropTypes.func,
};
