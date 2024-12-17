import { apiSlice } from '../../store/api/apiSlice';

export const resumeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Create a resume
        createResume: builder.mutation({
            query: (data) => ({
                url: '/resume/create',
                method: 'POST',
                body: { ...data },
            }),
            invalidatesTags: ['Resume'],
        }),

        // Get resume by user ID
        getResumeByUser: builder.query({
            query: (userId) => ({
                url: `/resume/${userId}`,
            }),
            providesTags: ['Resume'],
        }),

        // Get all resumes
        getAllResumes: builder.query({
            query: () => ({
                url: '/resume/',
            }),
            providesTags: ['Resume'],
        }),

        // Update a resume
        updateResume: builder.mutation({
            query: (resumeData) => ({
                url: '/resume/update',
                method: 'PUT',
                body: { ...resumeData },
            }),
            invalidatesTags: ['Resume'],
        }),

        // Delete a resume by ID
        deleteResume: builder.mutation({
            query: (resumeId) => ({
                url: `/resume/${resumeId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Resume'],
        }),
    }),
});

export const {
    useCreateResumeMutation,
    useGetResumeByUserQuery,
    useGetAllResumesQuery,
    useUpdateResumeMutation,
    useDeleteResumeMutation,
} = resumeApiSlice;