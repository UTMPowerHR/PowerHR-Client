import HomeSmileIcon from '../../icons/untitled-ui/duocolor/home-smile';
import PATHS from '@constants/routes/paths';
import { SvgIcon } from '@mui/material';

const applicantSection = [
    {
        items: [
            {
                title: 'Dashboard',
                path: PATHS.DASHBOARD.INDEX,
                icon: (
                    <SvgIcon fontSize="small">
                        <HomeSmileIcon />
                    </SvgIcon>
                ),
            },
            {
                subheader: 'Job Application',
                title: 'Job Application',
                items: [
                    {
                        title: 'Browse',
                        path: PATHS.JOB.INDEX,
                    },
                    {
                        title: 'History',
                        path: PATHS.APPLICATION.HISTORY,
                    },
                ],
            },
        ],
    },
];

export default applicantSection;
