import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
});

api.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN as string | undefined;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export async function fetchNotes({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<NotesResponse> {
  const trimmedSearch = search?.trim();

  const { data } = await api.get<NotesResponse>("/notes", {
    params: {
      page,
      perPage,
      ...(trimmedSearch ? { search: trimmedSearch } : {}),
    },
  });
  return data;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${noteId}`);
  return data;
}

export async function getSingleNote(noteId: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${noteId}`);
  return data;
}
