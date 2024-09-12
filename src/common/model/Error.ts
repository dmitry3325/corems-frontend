export interface Error {
  reasonCode: string;
  description: string;
  details?: string;
}

export interface ErrorResponse {
  errors: Error[];
}
