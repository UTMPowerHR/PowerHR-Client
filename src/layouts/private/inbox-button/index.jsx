import InboxIcon from '@mui/icons-material/Inbox';
import { IconButton, SvgIcon, Badge, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const InboxButton = () => {
    const navigate = useNavigate();

    const redirectToInboxPage = () => {
        navigate(`/user/inbox`);
    };

    return (
        <>
            <Tooltip title="Inbox">
                <IconButton onClick={() => redirectToInboxPage()}>
                        <SvgIcon>
                            <InboxIcon/>
                        </SvgIcon>
                </IconButton>
            </Tooltip>
        </>
    );
};