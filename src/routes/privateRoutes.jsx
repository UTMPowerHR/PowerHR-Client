import { Route } from 'react-router-dom';
import ProtectedRoute from '../utils/protectedRoute';
import { PrivateLayout } from '../layouts/private';

const privateRoutes = (
    <Route element={<ProtectedRoute />}>
        <Route element={<PrivateLayout />}>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Route>
    </Route>
);

export default privateRoutes;
