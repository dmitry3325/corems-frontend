import { createSlice } from "@reduxjs/toolkit";

import { USER_API_BASE_URL } from "@/user/config";
import { User } from "@/user/model/User";
import { AccessTokenResponse, Token, TokenResponse } from "@/user/model/Auth";
import { jwtDecode } from "jwt-decode";
import CoreMsApi, {
  ACCESS_TOKEN_TOKEN_KEY,
  HttpMethod,
  REFRESH_TOKEN_KEY,
} from "@/common/utils/CoreMsApi";
import { ApiSuccessfulResponse } from "@/common/model/Response";
import { set } from "react-hook-form";

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
  "/api/auth/signin"
);

export const signUpUser = userMsApi.createAsyncThunk<ApiSuccessfulResponse>(
  HttpMethod.POST,
  "/api/auth/signup"
);

const initialState: AuthState = {
  isAuthenticated: false,
  isInProgress: false,
};

const setRefreshToken = (state: AuthState, refreshToken: string | null) => {
  if (!refreshToken) {
    return;
  }

  try {
    state.parsedRefreshToken = jwtDecode<Token>(refreshToken);
  } catch (error) {
    console.error("Invalid refresh token", error);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    return;
  }

  state.isInProgress = false;
  state.isAuthenticated = true;

  state.refreshToken = refreshToken;
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

  state.user = {
    id: state.parsedRefreshToken.sub,
    email: state.parsedRefreshToken.email,
    fullName: state.parsedRefreshToken.user_name,
    roles: state.parsedRefreshToken.roles,
  } as User;
};

const setAccessToken = async (
  state: AuthState,
  accessToken: string | null,
  force: boolean = false
) => {
  if (!state.refreshToken) return;
  if (!accessToken || force) {
    try {
      const tokenResponse = await userMsApi.apiRequest<AccessTokenResponse>(
        HttpMethod.POST,
        "/api/auth/refresh-token",
        null,
        { Authorization: `Bearer ${state.refreshToken}` }
      );
      accessToken = tokenResponse.accessToken;
      localStorage.setItem(ACCESS_TOKEN_TOKEN_KEY, accessToken);
    } catch (error) {
      console.error("Failed to refresh token", error);
      state.isAuthenticated = false;
      state.user = undefined;
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(ACCESS_TOKEN_TOKEN_KEY);
      return;
    }

    const parsedAccessToken = jwtDecode<Token>(accessToken);
    const expiresIn = parsedAccessToken.exp * 1000 - Date.now();
    console.log(
      "Access token refreshed, expire in ",
      expiresIn / 60000,
      "minutes"
    );
    setTimeout(() => {
      setAccessToken(state, accessToken, true);
    }, Math.max(expiresIn - 30000, 0)); // Refresh 30s before expiration
  }

  state.accessToken = accessToken;
};
setRefreshToken(initialState, localStorage.getItem(REFRESH_TOKEN_KEY));
setAccessToken(initialState, localStorage.getItem(ACCESS_TOKEN_TOKEN_KEY));

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
        setRefreshToken(state, action.payload.refreshToken);
        setAccessToken(state, action.payload.accessToken);
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.isInProgress = false;
        state.isAuthenticated = false;
        throw action.payload;
      });
  },
});

export default authSlice.reducer;
