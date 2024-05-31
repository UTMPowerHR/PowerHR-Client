import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    persist: JSON.parse(localStorage.getItem('persist')) || false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.persist = true;
            localStorage.setItem('persist', JSON.stringify(true));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.persist = false;
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
