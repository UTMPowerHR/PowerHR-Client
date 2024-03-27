import { Route } from 'react-router-dom';
import Layout from '../layouts/public';
import CheckLogin from '../utils/checkLogin';

const publicRoutes = (
    <>
        <Route element={<Layout />}>
            <Route path="" element={<div>Home</div>} />
        </Route>
        <Route element={<CheckLogin />}>
            <Route element={<Layout />}></Route>
        </Route>
    </>
);

export default publicRoutes;
