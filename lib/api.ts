import axios from "axios";
import type { Note, NotesResponse, NoteTag } from "@/types/note";

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

type NotesApiRaw =
  | {
      notes: Note[];
      totalPages: number;
      page?: number;
      perPage?: number;
      totalItems?: number;
    }
  | any;

function normalizeNotesResponse(raw: NotesApiRaw): NotesResponse {
  const notes: Note[] = Array.isArray(raw?.notes)
    ? raw.notes
    : Array.isArray(raw?.items)
    ? raw.items
    : Array.isArray(raw?.data)
    ? raw.data
    : [];

  const totalPages: number =
    typeof raw?.totalPages === "number"
      ? raw.totalPages
      : typeof raw?.pages === "number"
      ? raw.pages
      : typeof raw?.meta?.totalPages === "number"
      ? raw.meta.totalPages
      : 0;

  const page =
    typeof raw?.page === "number"
      ? raw.page
      : typeof raw?.meta?.page === "number"
      ? raw.meta.page
      : undefined;

  const perPage =
    typeof raw?.perPage === "number"
      ? raw.perPage
      : typeof raw?.meta?.perPage === "number"
      ? raw.meta.perPage
      : undefined;

  const totalItems =
    typeof raw?.totalItems === "number"
      ? raw.totalItems
      : typeof raw?.meta?.totalItems === "number"
      ? raw.meta.totalItems
      : undefined;

  return { notes, totalPages, page, perPage, totalItems };
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<NotesResponse> {
  const { page, perPage, search } = params;

  const { data } = await api.get("/notes", {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
    },
  });

  return normalizeNotesResponse(data);
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get(`/notes/${id}`);
  const note: Note | undefined = data?.note ?? data;

  if (!note || typeof note !== "object") {
    throw new Error("Note not found");
  }

  return note as Note;
}

export type CreateNotePayload = {
  title: string;
  content: string;
  tag: NoteTag;
};

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const { data } = await api.post("/notes", payload);
  return (data?.note ?? data) as Note;
}

export async function deleteNote(id: string): Promise<void> {
  await api.delete(`/notes/${id}`);
}
