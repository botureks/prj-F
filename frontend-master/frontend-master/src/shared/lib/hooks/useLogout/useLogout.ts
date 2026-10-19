import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";

import { authActions } from "src/entities/Auth/model/slice/authSlice";

import { useToast } from "../useToast";

import USER_LOGOUT from "src/entities/Auth/api/gql/user-logout.model";

export const useLogout = () => {
    const dispatch = useDispatch();

    const [userLogout] = useMutation(USER_LOGOUT);
    const toast = useToast();

    const logout = () => {
        dispatch(authActions.deAuthenticate());

        userLogout()
            .then(response => {
                if (!response.data) {
                    return;
                }

                toast.base({ message: response.data.userLogout.message });
            })
    }

    return {
        logout
    }
}