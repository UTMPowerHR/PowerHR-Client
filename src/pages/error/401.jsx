import { Helmet } from 'react-helmet-async';
import { Box, Button, Container, Typography, useMediaQuery, CardMedia } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PATHS from '../../constants/paths';

const Page = () => {
    const theme = useTheme();
    const mdUp = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <Helmet>
                <title>Error: Authorization Required | PowerHR</title>
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
                            mb: 6,
                        }}
                    >
                        <CardMedia
                            component="img"
                            alt="Not authorized"
                            image="assets/errors/error-401.png"
                            sx={{
                                height: 'auto',
                                maxWidth: '100%',
                                width: 400,
                            }}
                        />
                    </Box>
                    <Typography align="center" variant={mdUp ? 'h1' : 'h4'}>
                        401: Authorization required
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
                        <Button component="a" href={PATHS.INDEX}>
                            Back to Home
                        </Button>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default Page;
