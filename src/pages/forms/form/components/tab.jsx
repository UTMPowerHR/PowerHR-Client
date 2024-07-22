import { Grid, Tab, Tabs } from '@mui/material';
import { Link, Outlet, matchPath, useLocation, useParams } from 'react-router-dom';
import PATHS from '@constants/routes/paths';

function useRouteMatch(patterns) {
    const { pathname } = useLocation();

    for (let i = 0; i < patterns.length; i += 1) {
        const pattern = patterns[i];
        const possibleMatch = matchPath(pattern, pathname);
        if (possibleMatch !== null) {
            return possibleMatch;
        }
    }

    return null;
}

function FormTab() {
    const routeMatch = useRouteMatch([PATHS.FORM.EDIT.PATH, PATHS.FORM.PREVIEW.PATH, PATHS.FORM.FEEDBACK.PATH]);
    const currentTab = routeMatch?.pattern?.path;
    const { id } = useParams();

    return (
        <Grid container spacing={5} mt={-10}>
            <Grid item xs={12}>
                <Tabs centered indicatorColor="primary" textColor="primary" value={currentTab} sx={{ px: 3 }}>
                    <Tab
                        label="Edit"
                        value={PATHS.FORM.EDIT.PATH}
                        component={Link}
                        to={PATHS.FORM.EDIT.URL(id)}
                        sx={{ width: 100 }}
                    />
                    <Tab
                        label="Preview"
                        value={PATHS.FORM.PREVIEW.PATH}
                        component={Link}
                        to={PATHS.FORM.PREVIEW.URL(id)}
                        sx={{ width: 100 }}
                    />
                    <Tab
                        label="Responses"
                        value={PATHS.FORM.FEEDBACK.PATH}
                        component={Link}
                        to={PATHS.FORM.FEEDBACK.URL(id)}
                        sx={{ width: 100 }}
                    />
                </Tabs>
            </Grid>
            <Grid item xs={12}>
                <Outlet />
            </Grid>
        </Grid>
    );
}

export default FormTab;
