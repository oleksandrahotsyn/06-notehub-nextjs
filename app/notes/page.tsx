import NotesClient from "./Notes.client";
import { fetchNotes, NotesResponse } from "@/lib/api";

export default async function NotesPage() {
  const PER_PAGE = 12;
  const INITIAL_PAGE = 1;
  const INITIAL_SEARCH = "";

  const INITIAL_DATA = await fetchNotes(INITIAL_PAGE, INITIAL_SEARCH, PER_PAGE);
  return (
    <NotesClient
      initialPage={INITIAL_PAGE}
      initialSearch={INITIAL_SEARCH}
      initialData={INITIAL_DATA}
    />
  );
}
