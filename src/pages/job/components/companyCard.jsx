import { Avatar, Card, CardContent, Link, Stack, Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import CompanyPosting from './companyPosting';
import PATHS from '@constants/routes/paths';

export default function CompanyCard(props) {
    const { index } = props;

    const company = useSelector((state) => state.job.companies[index]);

    return (
        <Card>
            <CardContent>
                <Stack
                    alignItems="flex-start"
                    spacing={2}
                    direction={{
                        xs: 'column',
                        sm: 'row',
                    }}
                >
                    <Avatar
                        component={'a'}
                        href={PATHS.COMPANY.PROFILE + '?id=' + company?._id}
                        alt="Company logo"
                        src={company?.logo}
                        variant="rounded"
                    />
                    <Stack>
                        <Link
                            color="text.primary"
                            component={'a'}
                            href={PATHS.COMPANY.PROFILE + '?id=' + company?._id}
                            variant="h6"
                        >
                            {company?.name}
                        </Link>
                        <Typography variant="body2">This is description</Typography>
                    </Stack>
                </Stack>
                <Box sx={{ mt: 2 }}>
                    <CompanyPosting index={index} />
                </Box>
            </CardContent>
        </Card>
    );
}

CompanyCard.propTypes = {
    // @ts-ignore
    index: PropTypes.number.isRequired,
};
