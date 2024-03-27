import PropTypes from 'prop-types';
import Settings04Icon from '@untitled-ui/icons-react/build/esm/Settings04';
import User03Icon from '@untitled-ui/icons-react/build/esm/User03';
import {
    Box,
    Button,
    Divider,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Popover,
    SvgIcon,
    Typography,
} from '@mui/material';
import useLogout from '../../../hooks/useLogout';
import { useSelector } from 'react-redux';
import PATHS from '../../../constants/routes/paths';

export const AccountPopover = (props) => {
    const { anchorEl, onClose, open, ...other } = props;
    const user = useSelector((state) => state.auth.user);
    const logout = useLogout();

    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom',
            }}
            disableScrollLock
            onClose={onClose}
            open={!!open}
            PaperProps={{ sx: { width: 200 } }}
            {...other}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="body1">
                    {user.firstName} {user.lastName}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                    {user.email}
                </Typography>
            </Box>
            <Divider />
            <Box sx={{ p: 1 }}>
                <ListItemButton
                    component="a"
                    href={PATHS.USER.PROFILE}
                    sx={{
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                    }}
                >
                    <ListItemIcon>
                        <SvgIcon fontSize="small">
                            <User03Icon />
                        </SvgIcon>
                    </ListItemIcon>
                    <ListItemText primary={<Typography variant="body1">Profile</Typography>} />
                </ListItemButton>
                <ListItemButton
                    component="a"
                    href={PATHS.USER.SETTING}
                    sx={{
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                    }}
                >
                    <ListItemIcon>
                        <SvgIcon fontSize="small">
                            <Settings04Icon />
                        </SvgIcon>
                    </ListItemIcon>
                    <ListItemText primary={<Typography variant="body1">Settings</Typography>} />
                </ListItemButton>
            </Box>
            <Divider sx={{ my: '0 !important' }} />
            <Box
                sx={{
                    display: 'flex',
                    p: 1,
                    justifyContent: 'center',
                }}
            >
                <Button color="inherit" onClick={logout} size="small">
                    Logout
                </Button>
            </Box>
        </Popover>
    );
};

AccountPopover.propTypes = {
    anchorEl: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool,
};
