import { Button, Card, Radio, Stack, SvgIcon, Typography } from '@mui/material';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setCreate } from '@features/job/jobSlice';

const categoryOptions = [
    {
        title: 'Full Time',
        value: 'full-time',
    },
    {
        title: 'Part Time',
        value: 'part-time',
    },
    {
        title: 'Freelance',
        value: 'freelance',
    },
    {
        title: 'Internship',
        value: 'internship',
    },
    {
        title: 'Contract',
        value: 'contract',
    },
];

export default function JobCategory(props) {
    const { onNext } = props;
    const category = useSelector((state) => state.job.create.category);
    const dispatch = useDispatch();

    const handleCategoryChange = (value) => {
        dispatch(setCreate({ name: 'category', value }));
    };

    return (
        <Stack spacing={3}>
            <div>
                <Typography variant="h6">I’m looking for...</Typography>
            </div>
            <Stack spacing={2}>
                {categoryOptions.map((option) => (
                    <Card
                        key={option.value}
                        sx={{
                            alignItems: 'center',
                            cursor: 'pointer',
                            display: 'flex',
                            p: 2,
                            ...(category === option.value && {
                                backgroundColor: 'primary.alpha12',
                                boxShadow: (theme) => `${theme.palette.primary.main} 0 0 0 1px`,
                            }),
                        }}
                        onClick={() => handleCategoryChange(option.value)}
                        variant="outlined"
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Radio checked={category === option.value} color="primary" />
                            <Typography variant="subtitle1">{option.title}</Typography>
                        </Stack>
                    </Card>
                ))}
            </Stack>
            <div>
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
            </div>
        </Stack>
    );
}

JobCategory.propTypes = {
    onNext: PropTypes.func,
};
