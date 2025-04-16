import { lazy } from 'react';

const CreateJob = lazy(() => import('./Create'));
const ListJob = lazy(() => import('./ManageJob'));
const Filter = lazy(() => import('./Filter'));
const Browse = lazy(() => import('./Browse'));
const Application = lazy(() => import('./Application'));
const History = lazy(() => import('./History'));

export { CreateJob, ListJob, Filter, Browse, Application, History };
