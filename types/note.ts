export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt?: string;
  created_at?: string;
  created?: string;
}
export interface NotesResponse {
  notes: Note[];
  totalPages: number;
  page?: number;
  perPage?: number;
  totalItems?: number;
}
