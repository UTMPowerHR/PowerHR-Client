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
    }),
});

export const { useUpdateUserMutation } = userApiSlice;
