import { apiSlice } from '../../store/api/apiSlice';

export const jobApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createPosting: builder.mutation({
            query: (credentials) => ({
                url: '/jobs/postings',
                method: 'POST',
                body: { ...credentials },
            }),
            invalidatesTags: ['Job'],
        }),
        getPostingListByCompanyId: builder.query({
            query: (companyId) => ({
                url: '/jobs/postings/company/' + companyId,
            }),
        }),
        getAllApplicationsByCompany: builder.query({
            query: ({ companyId, filterCriteria }) => ({
                url: `/jobs/applications/company/${companyId}`,
                params: filterCriteria,
            }),
        }),
        filterApplications: builder.mutation({
            query: ({ postingId, bodyRequirements }) => ({
                url: `/jobs/applications/filter/` + postingId,
                method: 'POST',
                body: { requirements: bodyRequirements },
            }),
        }),
        analyticOptionsApplications: builder.query({
            query: ({ companyId, status }) => ({
                url: `/jobs/applications/analytic-options/${companyId}`,
                params: { status },
            }),
        }),
        analyticCompletedApplications: builder.query({
            query: ({ companyId, years, employmentTypes, jobTitles, status }) => ({
                url: `/jobs/applications/analytic-completed/${companyId}`,
                params: { years, employmentTypes, jobTitles, status },
            }),
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
        getListIdApplications: builder.query({
            query: (applicantId) => ({
                url: '/jobs/applications/applicant/' + applicantId + '/list',
            }),
            providesTags: ['Application'],
        }),
        getApplicationByApplicant: builder.query({
            query: (applicantId) => ({
                url: '/jobs/applications/applicant/' + applicantId,
            }),
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
    useGetListIdApplicationsQuery,
    useCreateApplicationMutation,
    useGetApplicationsByPostingQuery,
    useUpdateApplicationMutation,
    useGetApplicationByApplicantQuery,
    useGetPostingListByCompanyIdQuery,
    useFilterApplicationsMutation,
    useAnalyticOptionsApplicationsQuery,
    useAnalyticCompletedApplicationsQuery,
    useGetAllApplicationsByCompanyQuery,
} = jobApiSlice;
