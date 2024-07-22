import { Grid, TextField } from '@mui/material';
import PropTypes from 'prop-types';

function ShortAnswerCollapse() {
    return (
        <>
            <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                    <TextField variant="standard" placeholder="Short answer text" fullWidth disabled />
                </Grid>
            </Grid>
        </>
    );
}

export default function ShortAnswer(props) {
    const { expand } = props;

    return <>{expand ? null : <ShortAnswerCollapse />}</>;
}

ShortAnswer.propTypes = {
    expand: PropTypes.bool,
};
