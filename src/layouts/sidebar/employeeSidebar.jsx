import HomeSmileIcon from '../../icons/untitled-ui/duocolor/home-smile';
import PATHS from '@constants/routes/paths';
import { SvgIcon } from '@mui/material';

const employeeSection = [
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
                        title: 'Fill Form',
                        path: PATHS.FORM.PUBLISH,
                    },
                ],
            },
            {
                title: 'Transfer Document',
                path: PATHS.JOB.TRANSFER_DOCUMENT,
            },
        ],
    },
];

export default employeeSection;
