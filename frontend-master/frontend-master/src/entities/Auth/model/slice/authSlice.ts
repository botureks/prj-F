import { createSlice } from "@reduxjs/toolkit";

import { AuthSchema } from "../types/authSchema";
import { UserRole } from "src/entities/User/model/types/user";

const initialState: AuthSchema = {
    isLoading: true,
    isLoggedIn: false,
    user: { username: '', id: '', role: UserRole.USER, isBlocked: false }
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        load: (state) => {
            state.isLoading = true;
            state.isLoggedIn = false;
        },
        authenticate: (state, action) => {
            state.isLoading = false;
            state.isLoggedIn = true;
            state.user = action.payload;
        },
        deAuthenticate: (state) => {
            state.isLoading = false;
            state.isLoggedIn = false;
        },
    }
})

export const { actions: authActions } = authSlice;
export const { reducer: authReducer } = authSlice;