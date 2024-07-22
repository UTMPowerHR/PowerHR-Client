import { Button, Stack, SvgIcon, Typography } from '@mui/material';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import PropTypes from 'prop-types';
import QuillEditor from './quillEditor';

export default function JobDescription(props) {
    const { onBack, onNext, edit, ...other } = props;

    return (
        <Stack spacing={3} {...other}>
            <div>
                <Typography variant="h6">How would you describe the job post?</Typography>
            </div>
            <QuillEditor sx={{ height: 400 }} />
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
                    {edit ? 'Save' : 'Create Job'}
                </Button>
                <Button color="inherit" onClick={onBack}>
                    Back
                </Button>
            </Stack>
        </Stack>
    );
}

JobDescription.propTypes = {
    onBack: PropTypes.func,
    onNext: PropTypes.func,
    edit: PropTypes.bool,
};
