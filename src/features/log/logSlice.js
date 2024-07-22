import { apiSlice } from '../../store/api/apiSlice';

export const logApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getLogs: builder.query({
            query: (companyId) => ({
                url: '/log/' + companyId,
            }),
        }),
    }),
});

export const { useGetLogsQuery } = logApiSlice;
