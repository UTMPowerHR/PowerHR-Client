import { Route } from 'react-router-dom';
import ProtectedRoute from '../utils/protectedRoute';
import { PrivateLayout } from '../layouts/private';
import PATHS from '../constants/routes/paths';

const privateRoutes = (
    <Route element={<ProtectedRoute />}>
        <Route element={<PrivateLayout />}>
            <Route path={PATHS.DASHBOARD.INDEX} element={<div>Dashboard</div>} />
        </Route>
    </Route>
);

export default privateRoutes;
