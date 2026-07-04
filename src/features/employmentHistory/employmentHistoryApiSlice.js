import { apiSlice } from '../../store/api/apiSlice';

export const employmentHistoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllEmploymentHistory: builder.query({
            query: () => ({
                url: '/company/employmenthistory',
                method: 'GET',
            }),
            providesTags: ['Company'],
        }),
    }),
});

export const { useGetAllEmploymentHistoryQuery } = employmentHistoryApiSlice;