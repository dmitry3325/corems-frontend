import axios, { AxiosResponse, CreateAxiosDefaults } from "axios";
import { ApiErrorResponse } from "@/common/model/Error";
import { createAsyncThunk } from "@reduxjs/toolkit";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

class CoreMsApi {
  private axios;

  public constructor(config?: CreateAxiosDefaults) {
    this.axios = axios.create(config);
  }

  public createAsyncThunk<T>(method: HttpMethod, url: string) {
    return createAsyncThunk(url, async (data: unknown, { rejectWithValue }) => {
      try {
        const response = await this.axios.request<T>({
          method,
          url,
          data,
          headers: { "Content-Type": "application/json" },
        });

        return response.data;
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
}

export default CoreMsApi;
