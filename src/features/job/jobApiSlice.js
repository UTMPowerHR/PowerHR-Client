import { apiSlice } from '../../store/api/apiSlice';

export const jobApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createPosting: builder.mutation({
            query: (credentials) => ({
                url: '/jobs/postings',
                method: 'POST',
                body: { ...credentials },
            }),
            invalidatesTags: ['Job'], // Tag name for invalidation
        }),
        getPosting: builder.mutation({
            query: (id) => ({
                url: '/jobs/postings/' + id,
            }),
        }),
        updatePosting: builder.mutation({
            query: (data) => ({
                url: '/jobs/postings/' + data.id,
                method: 'PUT',
                body: { ...data },
            }),
            invalidatesTags: ['Job'],
        }),
        getPostingsByCompany: builder.query({
            query: (companyId) => ({
                url: '/jobs/postings/company/' + companyId,
            }),
        }),
        getAllPostings: builder.query({
            query: () => ({
                url: '/jobs/postings',
            }),
        }),
        getIdPostingByApplicant: builder.query({
            query: (applicantId) => ({
                url: '/jobs/applications/applicant/' + applicantId,
            }),
            providesTags: ['Application'],
        }),
        createApplication: builder.mutation({
            query: (data) => ({
                url: '/jobs/applications',
                method: 'POST',
                body: { ...data },
            }),
            invalidatesTags: ['Application'],
        }),
        getApplicationsByPosting: builder.query({
            query: (postingId) => ({
                url: '/jobs/applications/posting/' + postingId,
            }),
        }),
        updateApplication: builder.mutation({
            query: (data) => ({
                url: '/jobs/applications/' + data.id,
                method: 'PUT',
                body: { ...data },
            }),
            invalidatesTags: ['Application'],
        }),
    }),
});

export const {
    useCreatePostingMutation,
    useGetPostingMutation,
    useUpdatePostingMutation,
    useGetPostingsByCompanyQuery,
    useGetAllPostingsQuery,
    useGetIdPostingByApplicantQuery,
    useCreateApplicationMutation,
    useGetApplicationsByPostingQuery,
    useUpdateApplicationMutation,
} = jobApiSlice;
