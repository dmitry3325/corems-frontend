export enum UserRole {
  Admin = "ADMIN",
  User = "USER",
}

export enum AuthProvider {
  google = "google",
  github = "github",
  linkedin = "linkedin",
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  roles: UserRole[];
}
