import type { AxiosResponse } from "axios";
import api from "./api";
import type {
  Note,
  FetchNotesParams,
  FetchNotesResponse,
  CreateNotePayload,
} from "@/types/note";
import type { AuthPayload, User } from "@/types/user";

// clientApi.ts
type UpdateUserPayload = {
  username?: string;
  email?: string;
  password?: string;
};

// Notes
export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const res: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
    params,
  });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res: AxiosResponse<Note> = await api.get(`/notes/${id}`);
  return res.data;
};

export const createNote = async (
  payload: CreateNotePayload
): Promise<Note> => {
  const res: AxiosResponse<Note> = await api.post("/notes", payload);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return res.data;
};

// Auth
export const register = async (payload: AuthPayload): Promise<User> => {
  const res: AxiosResponse<User> = await api.post("/auth/register", payload);
  return res.data;
};

export const login = async (payload: AuthPayload): Promise<User> => {
  const res: AxiosResponse<User> = await api.post("/auth/login", payload);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  const res: AxiosResponse<User | null> = await api.get("/auth/session");
  return res.data;
};

// User
export const getMe = async (): Promise<User> => {
  const res: AxiosResponse<User> = await api.get("/users/me");
  return res.data;
};

export const updateMe = async (
  payload: UpdateUserPayload
): Promise<User> => {
  const res: AxiosResponse<User> = await api.patch("/users/me", payload);
  return res.data;
};