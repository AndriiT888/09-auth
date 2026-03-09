// types/user.ts

export interface User {
   email: string;
  username: string;
  avatar: string;
}

export interface AuthPayload {
username: string;
  email: string;
  password: string;
}

