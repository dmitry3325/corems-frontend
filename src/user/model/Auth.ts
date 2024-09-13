export interface SignInUserRequest {
  email: string;
  password: string;
}

export interface SignUpUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface TokenResponse {
  refreshToken: string;
  accessToken: string;
}

export interface AccessTokenResponse {
  accessToken: string;
}

export interface Token {
  sub: string; // User ID here
  user_name: string;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
}
