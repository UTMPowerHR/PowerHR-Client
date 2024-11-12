import PATHS from '@constants/routes/paths';
import { SvgIcon } from '@mui/material';
import HomeSmileIcon from '../../icons/untitled-ui/duocolor/home-smile';

const hrSection = [
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
                subheader: 'Forms',
                title: 'Forms',
                items: [
                    {
                        title: 'Manage',
                        path: PATHS.FORM.INDEX,
                    },
                ],
            },
            {
                title: 'Company',
                items: [
                    {
                        title: 'Profile',
                        path: PATHS.COMPANY.PROFILE,
                    },
                    {
                        title: 'Terminate Employee',
                        path: PATHS.COMPANY.DOCUMENTLIST
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
                title: 'Job',
                items: [
                    {
                        title: 'List Job',
                        path: PATHS.JOB.LIST,
                    },
                    {
                        title: 'Create Job',
                        path: PATHS.JOB.CREATE,
                    },
                ],
            },
            {
                title: 'Analytic',
                items: [
                    {
                        title: 'Turnover',
                        path: PATHS.ANALYTIC.TURNOVER,
                    },
                ],
            },
        ],
    },
];

export default hrSection;
