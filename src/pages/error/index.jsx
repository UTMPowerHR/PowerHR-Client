import { lazy } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
const Page401 = lazy(() => import('./401'));

function ErrorPage() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            return <Page401 />;
        }

        if (error.status === 401) {
            return <div>You aren&apos;t authorized to see this</div>;
        }

        if (error.status === 503) {
            return <div>Looks like our API is down</div>;
        }

        if (error.status === 418) {
            return <div>&#129380;</div>;
        }
    }

    return <div>Something went wrong</div>;
}

export default ErrorPage;
