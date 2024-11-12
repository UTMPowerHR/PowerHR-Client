import { lazy } from 'react';

const CreateJob = lazy(() => import('./Create'));
const ListJob = lazy(() => import('./ManageJob'));
const Browse = lazy(() => import('./Browse'));
const Application = lazy(() => import('./Application'));
const History = lazy(() => import('./History'));
const Example = lazy(() => import('./Example'));
const TransferDocument = lazy(() => import('./TransferDocument'));

export { CreateJob, ListJob, Browse, Application, Example, History, TransferDocument, };
