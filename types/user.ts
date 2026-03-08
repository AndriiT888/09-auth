export interface User {
  email: string;
  username: string;
  avatar: string;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  avatar?: string;
  password?: string;
}