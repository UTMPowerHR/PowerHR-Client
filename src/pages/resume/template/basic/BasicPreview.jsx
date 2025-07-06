import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import * as Card from './component';
import { useSelector } from 'react-redux';
import renderCard from '../../component/card';

export default function BasicPreview() {
    const data = useSelector((state) => state.applicant.resume);
    const titleColor = data.template?.settings?.titleColor || '#000000';
    const contentColor = data.template?.settings?.contentColor || '#000000';

    const size = {
        width: '8.27in',
        minHeight: '11.69in',
        p: 5,
    };

    return (
        <Paper sx={{ ...size, backgroundColor: 'white' }}>
            <Stack spacing={0}>
                <Typography variant="h4" sx={{ color: titleColor }}>
                    {data.basicDetail.name}
                </Typography>
                <Typography variant="h6" sx={{ color: titleColor }}>
                    {data.basicDetail.title}
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Typography variant="body1" sx={{ color: contentColor }}>
                        {data.basicDetail.email}
                    </Typography>
                    {data.basicDetail.phone !== '' && (
                        <Typography variant="body1" sx={{ color: contentColor }}>
                            |
                        </Typography>
                    )}
                    <Typography variant="body1" sx={{ color: contentColor }}>
                        {data.basicDetail.phone}
                    </Typography>
                    {data.basicDetail.location !== '' && (
                        <Typography variant="body1" sx={{ color: contentColor }}>
                            |
                        </Typography>
                    )}
                    <Typography variant="body1" sx={{ color: contentColor }}>
                        {data.basicDetail.location}
                    </Typography>
                </Stack>
                <Typography variant="body1" sx={{ color: contentColor }}>
                    {data.basicDetail.websiteUrl.linkedin}
                </Typography>
            </Stack>

            <Grid container>
                <Grid item xs={12}>
                    <Box>
                        <Stack spacing={1} sx={{ mt: 2 }}>
                            {data.template.pages[0]?.columns[0]?.list.map((item, index) => (
                                <Box key={index} sx={{ width: '100%' }}>
                                    <Paper sx={{ backgroundColor: 'white' }} elevation={0}>
                                        {renderCard(Card, item, 0, true)}
                                    </Paper>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}
