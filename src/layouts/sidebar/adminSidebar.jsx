import PATHS from '@constants/routes/paths';
import { SvgIcon } from '@mui/material';
import HomeSmileIcon from '../../icons/untitled-ui/duocolor/home-smile';

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
                title: 'Profile',
                path: PATHS.EMPLOYEE.PROFILE,
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
        ],
    },
];

export default adminSection;
