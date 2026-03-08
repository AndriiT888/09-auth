import type { AxiosResponse } from "axios";
import api from "./api";
import { cookies } from "next/headers";
import type {
  Note,
  FetchNotesParams,
  FetchNotesResponse,
} from "@/types/note";
import type { User } from "@/types/user";

const withCookies = async () => {
  const cookieStore = await cookies();
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return {
    headers: {
      Cookie: cookieString,
    },
  };
};

// Notes
export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const res: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
    params,
    ...(await withCookies()),
  });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res: AxiosResponse<Note> = await api.get(
    `/notes/${id}`,
    await withCookies()
  );
  return res.data;
};

// Auth
export const checkSession = async (): Promise<User | null> => {
  const res: AxiosResponse<User | null> = await api.get(
    "/auth/session",
    await withCookies()
  );
  return res.data;
};

// User
export const getMe = async (): Promise<User> => {
  const res: AxiosResponse<User> = await api.get(
    "/users/me",
    await withCookies()
  );
  return res.data;
};