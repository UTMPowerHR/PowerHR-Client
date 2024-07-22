import { apiSlice } from '../../store/api/apiSlice';

export const formApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createForm: builder.mutation({
            query: ({ createdBy, company, name, description }) => ({
                url: '/forms/',
                method: 'POST',
                body: { createdBy, company, name, description },
            }),
            invalidatesTags: ['Form'], // Tag name for invalidation
        }),
        getAllFormsByUser: builder.query({
            query: (id) => ({
                url: '/forms/user/' + id,
            }),
            providesTags: ['Form'], // Tag name for caching
        }),
        deleteForm: builder.mutation({
            query: (id) => ({
                url: '/forms/' + id,
                method: 'DELETE',
            }),
            invalidatesTags: ['Form'], // Tag name for invalidation
        }),
        getFormByIdWithSnapshot: builder.query({
            query: (id) => ({
                url: '/forms/' + id + '/snapshot',
            }),
            providesTags: ['Form'], // Tag name for caching
        }),
        updateForm: builder.mutation({
            query: (data) => ({
                url: '/forms',
                method: 'PUT',
                body: { ...data },
            }),
            invalidatesTags: ['Form'], // Tag name for invalidation
        }),
        getAllPublishFormsByCompany: builder.query({
            query: ({ companyId, userId }) => ({
                url: '/forms/publish/all/' + companyId + '/' + userId,
            }),
            providesTags: ['Form'], // Tag name for caching
        }),
        getPublishFormById: builder.query({
            query: (id) => ({
                url: '/forms/publish/' + id,
            }),
            providesTags: ['Form'], // Tag name for caching
        }),
        submitForm: builder.mutation({
            query: (data) => ({
                url: '/forms/feedbacks/' + data.id + '/' + data.userId,
                method: 'POST',
                body: { ...data },
            }),
            invalidatesTags: ['Form'], // Tag name for invalidation
        }),
        getFeedbacksByFormId: builder.query({
            query: (id) => ({
                url: '/forms/feedbacks/' + id,
            }),
            providesTags: ['Form'], // Tag name for caching
        }),
    }),
});

export const {
    useCreateFormMutation,
    useGetAllFormsByUserQuery,
    useDeleteFormMutation,
    useGetFormByIdWithSnapshotQuery,
    useUpdateFormMutation,
    useGetAllPublishFormsByCompanyQuery,
    useGetPublishFormByIdQuery,
    useSubmitFormMutation,
    useGetFeedbacksByFormIdQuery,
} = formApiSlice;
