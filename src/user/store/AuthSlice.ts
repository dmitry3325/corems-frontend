import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { USER_API_BASE_URL } from "@/user/config";
import { User } from "@/user/model/User";
import { ErrorResponse } from "@/common/model/Error";
import { SignInUserRequest, TokenResponse } from "@/user/model/Auth";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  isAuthenticated: boolean;
  isInProgress: boolean;
  accessToken?: string;
  refereshToken?: string;
  user?: User;
  error?: ErrorResponse;
}

const userMsApi = axios.create({ baseURL: USER_API_BASE_URL });

export const signInUser = createAsyncThunk(
  "auth/signInUser",
  async (userData: SignInUserRequest) => {
    return await userMsApi.post<TokenResponse>(
      USER_API_BASE_URL + "/api/auth/login",
      userData
    );
  }
);

const initialState: AuthState = {
  isAuthenticated: false,
  isInProgress: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    signOut(state) {
      state.isAuthenticated = false;
      state.user = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.pending, (state) => {
        state.isInProgress = true;
        state.isAuthenticated = false;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.isInProgress = false;
        state.isAuthenticated = true;

        const tokenResponse = action.payload.data;
        localStorage.setItem("refreshToken", tokenResponse.refreshToken);
        state.accessToken = tokenResponse.accessToken;
        state.refereshToken = tokenResponse.refreshToken;
        const user = jwtDecode<User>(tokenResponse.refreshToken);
        state.user = user;

        console.log(state.isAuthenticated);
        console.log(user);
      });
  },
});

export default authSlice.reducer;
