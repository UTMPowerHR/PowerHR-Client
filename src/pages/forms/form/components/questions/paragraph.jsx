import { Grid, TextField } from '@mui/material';
import PropTypes from 'prop-types';

function ParagraphCollapse() {
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField variant="standard" placeholder="Long answer text" fullWidth disabled />
                </Grid>
            </Grid>
        </>
    );
}

export default function Paragraph(props) {
    const { expand } = props;

    return <>{expand ? null : <ParagraphCollapse />}</>;
}

Paragraph.propTypes = {
    expand: PropTypes.bool,
};
