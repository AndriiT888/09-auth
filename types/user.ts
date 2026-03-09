// types/user.ts

export interface User {
   email: string;
  username: string;
  avatar: string;
}

export interface AuthPayload {
  email: string;
  password: string;
}

