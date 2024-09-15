export interface ApiSuccessfulResponse {
  resiult: boolean;
}

export interface Error {
  reasonCode: string;
  description: string;
  details?: string;
}

export interface ApiErrorResponse {
  errors: Error[];
}
