import useLogout from '../../hooks/useLogout';
import { Button } from '@mui/material';

const LogoutButton = (props) => {
    const logout = useLogout();

    return (
        <Button variant="contained" color="secondary" onClick={() => logout()} {...props}>
            Logout
        </Button>
    );
};

export default LogoutButton;
