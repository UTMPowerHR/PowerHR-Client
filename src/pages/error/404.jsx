import { Helmet } from 'react-helmet-async';
import { Box, Button, Container, Typography, useMediaQuery, CardMedia } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PATHS from '../../constants/routes/paths';

const Page = () => {
    const theme = useTheme();
    const mdUp = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <Helmet>
                <title>Page Not Found | PowerHR</title>
            </Helmet>
            <Box
                component="main"
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexGrow: 1,
                    py: '80px',
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 1,
                        }}
                    >
                        <CardMedia
                            component="img"
                            alt="Not authorized"
                            image="assets/errors/404.png"
                            sx={{
                                height: 'auto',
                                maxWidth: '100%',
                                width: 500,
                            }}
                        />
                    </Box>
                    <Typography align="center" variant={mdUp ? 'h1' : 'h4'}>
                        404: Page Not Found
                    </Typography>
                    <Typography align="center" color="text.secondary" sx={{ mt: 0.5 }}>
                        You either tried some shady route or you came here by mistake. Whichever it is, try using the
                        navigation.
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 6,
                        }}
                    >
                        <Button component="a" href={PATHS.HOME} variant="contained">
                            Back to Home
                        </Button>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default Page;
