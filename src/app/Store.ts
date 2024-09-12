import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/user/store/AuthSlice";

console.log("Store Init");

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
