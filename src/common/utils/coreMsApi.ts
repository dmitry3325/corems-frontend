import axios, { AxiosResponse } from "axios";
import { ApiErrorResponse } from "@/common/model/Response";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface CoreMsApiConfig {
  baseURL: string;
  useAccessToken?: boolean;
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export const REFRESH_TOKEN_KEY = "refreshToken";
export const ACCESS_TOKEN_TOKEN_KEY = "accessToken";

class CoreMsApi {
  private axios;
  private config: CoreMsApiConfig;

  public constructor(config: CoreMsApiConfig) {
    this.config = config;
    this.axios = axios.create({ baseURL: config.baseURL });
  }

  public async apiRequest<T>(
    method: HttpMethod,
    url: string,
    data?: unknown,
    headers?: Record<string, string>
  ) {
    const response = await this.axios.request<T>({
      method,
      url,
      data,
      headers: headers ?? this.getDefaultHeaders(),
    });

    return response.data;
  }

  public createAsyncThunk<T>(
    method: HttpMethod,
    url: string,
    headers?: Record<string, string>
  ) {
    return createAsyncThunk(url, async (data: unknown, { rejectWithValue }) => {
      try {
        return await this.apiRequest<T>(method, url, data, headers);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error("CoreMs api call error:", error.response.data);
          return rejectWithValue(
            error.response as AxiosResponse<ApiErrorResponse>
          );
        }
        throw error;
      }
    });
  }

  private getDefaultHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const accessToken = localStorage.getItem(ACCESS_TOKEN_TOKEN_KEY);
    if (this.config.useAccessToken && accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return headers;
  }
}

export default CoreMsApi;
