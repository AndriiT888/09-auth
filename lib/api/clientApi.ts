import type { AxiosResponse } from "axios";
import api from "./api";
import type {
  Note,
  FetchNotesParams,
  FetchNotesResponse,
  CreateNotePayload,
} from "@/types/note";
import type { AuthPayload, UpdateUserPayload, User } from "@/types/user";

// ============ Axios-based (через api instance) ============

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

// ============ Fetch-based (через Next.js API routes) ============

type SignInData = {
  email: string;
  password: string;
};

export async function signInUser(data: SignInData) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Invalid credentials");
  }

  return res.json();
}

export async function logoutUser() {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }

  return res.json().catch(() => ({}));
}

export async function getCurrentUser() {
  const res = await fetch("/api/users/me", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Not authenticated");
  }

  return res.json();
}

export async function updateUserName(username: string) {
  const res = await fetch("/api/users/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username }),
  });

  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}