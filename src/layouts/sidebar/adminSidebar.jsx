import PATHS from '@constants/routes/paths';
import { SvgIcon } from '@mui/material';
import HomeSmileIcon from '../../icons/untitled-ui/duocolor/home-smile';
import ActivityIcon from '../../icons/untitled-ui/duocolor/activity';

const adminSection = [
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
                title: 'Company',
                items: [
                    {
                        title: 'Manage Company',
                        path: PATHS.COMPANY.MANAGE.INDEX,
                    },
                    {
                        title: 'Profile',
                        path: PATHS.COMPANY.PROFILE,
                    },
                    {
                        title: 'Manage Departments',
                        path: PATHS.COMPANY.MANAGE.DEPARTMENTS,
                    },
                ],
            },
            {
                title: 'Employees',
                items: [
                    {
                        title: 'Manage Employees',
                        path: PATHS.COMPANY.MANAGE.EMPLOYEES,
                    },
                ],
            },
            {
                title: 'Monitor',
                path: PATHS.MONITOR.INDEX,
                icon: (
                    <SvgIcon fontSize="small">
                        <ActivityIcon />
                    </SvgIcon>
                ),
            },
        ],
    },
];

export default adminSection;
