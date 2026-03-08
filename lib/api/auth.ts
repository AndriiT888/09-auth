import type { AxiosResponse } from "axios";
import api from "./axios";
import type { AuthPayload, User } from "@/types/user";

export const login = async (payload: AuthPayload): Promise<User> => {
  const res: AxiosResponse<User> = await api.post("/auth/login", payload);
  return res.data;
};

export const register = async (payload: AuthPayload): Promise<User> => {
  const res: AxiosResponse<User> = await api.post("/auth/register", payload);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const getSession = async (): Promise<User | null> => {
  const res: AxiosResponse<User | null> = await api.get("/auth/session");
  return res.data;
};