import { createSlice } from "@reduxjs/toolkit";

import { USER_API_BASE_URL } from "@/user/config";
import { User } from "@/user/model/User";
import { Token, TokenResponse } from "@/user/model/Auth";
import { jwtDecode } from "jwt-decode";
import CoreMsApi, { HttpMethod } from "../../common/utils/coreMsApi";

interface AuthState {
  isAuthenticated: boolean;
  isInProgress: boolean;
  accessToken?: string;
  refreshToken?: string;
  parsedRefreshToken?: Token;
  user?: User;
}

const userMsApi = new CoreMsApi({ baseURL: USER_API_BASE_URL });

export const signInUser = userMsApi.createAsyncThunk<TokenResponse>(
  HttpMethod.POST,
  "/api/auth/login"
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

        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;

        state.parsedRefreshToken = jwtDecode<Token>(
          action.payload.refreshToken
        );

        state.user = {
          id: state.parsedRefreshToken.sub,
          email: state.parsedRefreshToken.email,
          fullName: state.parsedRefreshToken.user_name,
          roles: state.parsedRefreshToken.roles,
        } as User;

        console.log("User:", state.user);
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.isInProgress = false;
        state.isAuthenticated = false;
        throw action.payload;
      });
  },
});

export default authSlice.reducer;
