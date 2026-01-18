import axios from "axios";
import type { Note, NoteTag } from "@/types/note";

const BASE_URL = "https://notehub-public.goit.study/api";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export type FetchNotesParams = {
  page: number;
  perPage: number;
  search?: string;
};
export interface NotesResponse {
  notes: Note[];
  totalPages: number;
  page?: number;
  perPage?: number;
  totalItems?: number;
}

type NoteApiResponse = { note: Note };

function unwrapNote(data: Note | NoteApiResponse): Note {
  return "note" in data ? data.note : data;
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<NotesResponse> {
  const { page, perPage, search } = params;

  const { data } = await api.get<NotesResponse>("/notes", {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
    },
  });

  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note | NoteApiResponse>(`/notes/${id}`);
  return unwrapNote(data);
}

export type CreateNotePayload = {
  title: string;
  content: string;
  tag: NoteTag;
};

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const { data } = await api.post<Note | NoteApiResponse>("/notes", payload);
  return unwrapNote(data);
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note | NoteApiResponse>(`/notes/${id}`);
  return unwrapNote(data);
}
