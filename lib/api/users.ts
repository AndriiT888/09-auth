import type { AxiosResponse } from "axios";
import api from "./axios";
import type {User } from "@/types/user";

export const getMe = async (): Promise<User> => {
  const res: AxiosResponse<User> = await api.get("/users/me");
  return res.data;
};

// export const updateMe = async (payload: UpdateUserPayload): Promise<User> => {
//   const res: AxiosResponse<User> = await api.patch("/users/me", payload);
//   return res.data;
// };