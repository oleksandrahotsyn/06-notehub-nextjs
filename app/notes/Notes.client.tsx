"use client";

import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { fetchNotes } from "@/lib/api";
import type { NotesResponse } from "@/types/note";
import css from "@/app/notes/NotesPage.module.css";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";

type NotesClientProps = {
  initialPage: number;
  initialSearch: string;
  perPage: number;
};

export default function NotesClient({
  initialPage,
  initialSearch,
  perPage,
}: NotesClientProps) {
  const [page, setPage] = useState<number>(initialPage);
  const [search, setSearch] = useState<string>(initialSearch);
  const [isCreating, setIsCreating] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);
  const effectivePage = useMemo(() => {
    return debouncedSearch !== initialSearch ? 1 : page;
  }, [debouncedSearch, initialSearch, page]);

  const { data, isLoading, error } = useQuery<NotesResponse>({
    queryKey: ["notes", effectivePage, perPage, debouncedSearch],
    queryFn: () =>
      fetchNotes({ page: effectivePage, perPage, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (error || !data) {
    return <p>Something went wrong.</p>;
  }

  return (
    <>
      <div className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        <button type="button" onClick={() => setIsCreating(true)}>
          Create note
        </button>
        {isCreating && (
          <Modal onClose={() => setIsCreating(false)}>
            <NoteForm onCancel={() => setIsCreating(false)} />
          </Modal>
        )}
      </div>
      <NoteList notes={data.notes} onDelete={() => {}} />
    </>
  );
}
