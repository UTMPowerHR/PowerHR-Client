import PropTypes from 'prop-types';
import { Box, Stack, Typography } from '@mui/material';

export const TenantSwitch = (props) => {
    return (
        <>
            <Stack alignItems="center" direction="row" spacing={2} {...props}>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography color="inherit" variant="h6">
                        PowerHR
                    </Typography>
                    <Typography color="neutral.400" variant="body2">
                        System
                    </Typography>
                </Box>
            </Stack>
        </>
    );
};

TenantSwitch.propTypes = {
    sx: PropTypes.object,
};
