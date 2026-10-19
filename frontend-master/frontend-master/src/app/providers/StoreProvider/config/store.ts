import { configureStore } from "@reduxjs/toolkit";

import { StateSchema } from "./StateSchema";

import { authReducer } from "src/entities/Auth/model/slice/authSlice";

export function createReduxStore(initialState?: StateSchema) {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    devTools: process.env.NODE_ENV === "development",
    preloadedState: initialState,
  });
}
