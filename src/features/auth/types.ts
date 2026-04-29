export type UserRole = "ADMIN" | "ANALYST";

export interface User {
  id: string;
  githubId: string;
  username: string;
  email: string | null;
  avatarUrl: string | null;
  name: string | null;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhoamiResponse {
  status: "success";
  data: User;
}
