import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import * as Card from './component';
import { useSelector } from 'react-redux';
import renderCard from '../../component/card';

export default function ModernPreview() {
    const data = useSelector((state) => state.applicant.resume);
    const titleColor = data.template?.setting?.titleColor || '#000000';
    const contentColor = data.template?.setting?.contentColor || '#000000';

    const size = {
        width: '8.27in',
        minHeight: '11.69in',
    };

    return (
        <Paper sx={{ ...size, backgroundColor: 'white' }} id="resume-container">
            <Box sx={{ backgroundColor: '#f5f5f5', p: 2 }}>
                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                    <Stack sx={{ flexGrow: 1 }}>
                        <Typography variant="h4" id="title" style={{ color: titleColor }}>
                            {data.basicDetail.name}
                        </Typography>
                        <Typography variant="h6" id="title" style={{ color: titleColor }}>
                            {data.basicDetail.title}
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Typography variant="body1" id="content" style={{ color: contentColor }}>
                                {data.basicDetail.email}
                            </Typography>
                            <Typography variant="body1" id="content" style={{ color: contentColor }}>
                                {data.basicDetail.phone}
                            </Typography>
                            <Typography variant="body1" id="content" style={{ color: contentColor }}>
                                {data.basicDetail.location}
                            </Typography>
                        </Stack>

                        <Typography variant="body1" id="content" style={{ color: contentColor }}>
                            {data.basicDetail.websiteUrl.linkedin}
                        </Typography>
                    </Stack>
                    <Stack>
                        <Box
                            component="img"
                            src={data.basicDetail.imageURL}
                            alt="Profile"
                            sx={{
                                width: 90,
                                height: 90,
                                borderRadius: '50%',
                            }}
                        />
                    </Stack>
                </Stack>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={7}>
                    <Box>
                        <Stack spacing={2}>
                            {data.template.pages[0]?.columns[0]?.list.map((item, index) => (
                                <Paper key={index} sx={{ p: 2, backgroundColor: 'white' }} elevation={0}>
                                    {renderCard(Card, item, 0, true)}
                                </Paper>
                            ))}
                        </Stack>
                    </Box>
                </Grid>

                <Grid item xs={5}>
                    <Box>
                        <Stack spacing={2}>
                            {data.template.pages[0]?.columns[1]?.list.map((item, index) => (
                                <Paper key={index} sx={{ p: 2, backgroundColor: 'white' }} elevation={0}>
                                    {renderCard(Card, item, 1, true)}
                                </Paper>
                            ))}
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}
