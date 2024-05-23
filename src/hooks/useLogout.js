// import { logout as logoutThunk } from '../features/authentication/authSlice';
// import { useLogoutMutation } from '../features/authentication/authApiSlice';
// import { useDispatch } from 'react-redux';

const useLogout = () => {
    // const dispatch = useDispatch();
    //const [logout] = useLogoutMutation();

    const logoutUser = async () => {
        // try {
        //     await logout({})
        //         .unwrap()
        //         .then(() => {
        //             dispatch(logoutThunk());
        //         });
        // } catch (err) {
        //     console.error(err);
        // }
    };

    return logoutUser;
};

export default useLogout;
