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
  id: string;
  email: string;
  fullName: string;
  roles: UserRole[];
}
