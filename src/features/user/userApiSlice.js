import { apiSlice } from '../../store/api/apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateUser: builder.mutation({
            query: ({ user, role, id }) => ({
                url: '/users/' + role + '/' + id,
                method: 'PUT',
                body: { user },
            }),
        }),
        uploadProfileImage: builder.mutation({
            query: ({ formData, id }) => ({
                url: '/users/upload/profile-picture/' + id,
                method: 'POST',
                body: formData,
                formData: true,
            }),
        }),
    }),
});

export const { useUpdateUserMutation, useUploadProfileImageMutation } = userApiSlice;
