"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { fetchNotes } from "@/lib/api";
import type { NotesResponse } from "@/lib/api";
import css from "@/app/notes/NotesPage.module.css";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";
import Pagination from "@/components/Pagination/Pagination";

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

  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    setPage(1);
  }, [debouncedSearch]);

  const queryKey = useMemo(
    () => ["notes", page, perPage, debouncedSearch] as const,
    [page, perPage, debouncedSearch]
  );

  const { data, isLoading, error } = useQuery<NotesResponse>({
    queryKey,
    queryFn: () => fetchNotes({ page, perPage, search: debouncedSearch }),
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
        <SearchBox onChange={setSearch} />
        <Pagination
          pageCount={data.totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
        <button
          className={css.button}
          type="button"
          onClick={() => setIsCreating(true)}
        >
          Create note
        </button>

        {isCreating && (
          <Modal onClose={() => setIsCreating(false)}>
            <NoteForm onCancel={() => setIsCreating(false)} />
          </Modal>
        )}
      </div>

      <NoteList notes={data.notes} />
    </>
  );
}
