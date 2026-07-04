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
            query: ({ image, id }) => ({
                url: '/users/upload/profile-picture/' + id,
                method: 'POST',
                body: { image, id }, // JSON payload with Base64-encoded image and user ID
                headers: {
                    'Content-Type': 'application/json', // Explicitly set Content-Type to JSON
                },
            }),
        }),

        getUserById: builder.query({
            query: (role, id) => ({
                url: '/users/' + role + "/" + id,
                method: 'GET',
            }),
            providesTags: ['User'],
        }),

    }),
});

export const { useUpdateUserMutation, useUploadProfileImageMutation, useGetUserByIdQuery} = userApiSlice;
