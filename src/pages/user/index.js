import { lazy } from 'react';

const Account = lazy(() => import('./Account'));
const Dashboard = lazy(() => import('./Dashboard'));
const Inbox = lazy(() => import('./Inbox'));

export { Account, Dashboard, Inbox };
