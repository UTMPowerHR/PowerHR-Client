import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { logout, setCredentials } from '../../features/authentication/authSlice';
import { API } from '@constants/env';

const baseQuery = fetchBaseQuery({
    baseUrl: API,
    prepareHeaders: (headers, { getState }) => {
        const state = getState();
        const token = state.auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // if (result?.error?.originalStatus === 403) {
    //     const refreshResult = await baseQuery('/refresh', api, extraOptions);
    //     if (refreshResult?.data) {
    //         const state = api.getState();
    //         const user = state.auth.user;
    //         api.dispatch(setCredentials({ ...refreshResult.data, user }));
    //         result = await baseQuery(args, api, extraOptions);
    //     } else {
    //         api.dispatch(logout());
    //     }
    // }

    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Form', 'Application'],
    // eslint-disable-next-line
    endpoints: (_builder) => ({}),
});
