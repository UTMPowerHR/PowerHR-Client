import { lazy } from 'react';

const Account = lazy(() => import('./Account'));
const Dashboard = lazy(() => import('./Dashboard'));

export { Account, Dashboard };
