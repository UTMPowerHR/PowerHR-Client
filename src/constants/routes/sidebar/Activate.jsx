import { useActivateAccountMutation, useVerifyTokenQuery } from '../../features/authentication/authApiSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, Stack, Alert } from '@mui/material';
import { LoadingComponent } from '../../components/loading';
import PATHS from '../../constants/routes/paths';
import { useEffect } from 'react';
import Show from '../../components/show';

const Activate = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { error, isLoading, isSuccess, isError } = useVerifyTokenQuery(token);

    const [activateAccount, { isLoading: isActivating, error: activationError, isError: isActivationError }] =
        useActivateAccountMutation();

    useEffect(() => {
        const activateAndRedirect = async () => {
            if (isSuccess) {
                // Activate account
                await activateAccount(token)
                    .unwrap()
                    .then(() => {
                        navigate(PATHS.AUTH.LOGIN);
                    });
            }
        };

        activateAndRedirect();
    }, [isSuccess, token, activateAccount, navigate]);

    console.log({ error, isLoading, isSuccess, isActivating, activationError });

    return (
        <>
            <LoadingComponent isLoading={false || isLoading || isActivating}>
                <Show when={isError || isActivationError || false}>
                    <Card elevation={16}>
                        <CardHeader sx={{ pb: 0 }} title="Activate Account" />

                        <CardContent>
                            <Stack spacing={3}>
                                <Alert severity="error">
                                    {error?.data?.error || activationError?.data?.error || `Something went wrong!`}
                                </Alert>
                            </Stack>

                            <Stack spacing={3} sx={{ mt: 3 }}>
                                <Button fullWidth size="large" variant="contained">
                                    Request new activation link
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Show>
            </LoadingComponent>
        </>
    );
};

export default Activate;
