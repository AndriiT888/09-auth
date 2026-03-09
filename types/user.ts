// types/user.ts

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  password?: string;
}