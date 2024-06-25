import { lazy } from 'react';

const CreateJob = lazy(() => import('./Create'));
const ListJob = lazy(() => import('./ListJob'));
const Browse = lazy(() => import('./Browse'));
const Application = lazy(() => import('./Application'));

export { CreateJob, ListJob, Browse, Application };
