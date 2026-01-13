"use client";

import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

import { fetchNotes } from "@/lib/api";
import type { Note } from "@/types/note";

const PER_PAGE = 12;

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const notesQuery = useQuery({
    queryKey: ["notes", page, PER_PAGE, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch,
      }),
    placeholderData: keepPreviousData,
  });

  const notes: Note[] = useMemo(
    () => notesQuery.data?.notes ?? [],
    [notesQuery.data]
  );

  const totalPages = notesQuery.data?.totalPages ?? 0;

  return (
    <div>
      <header>
        <SearchBox value={search} onChange={setSearch} />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button type="button" onClick={() => setIsCreateOpen(true)}>
          Create note +
        </button>
      </header>

      {(notesQuery.isLoading ||
        (notesQuery.isFetching && !notesQuery.isError)) && <Loader />}

      {notesQuery.isError && <ErrorMessage />}

      {notes.length > 0 && <NoteList notes={notes} />}

      {isCreateOpen && (
        <Modal onClose={() => setIsCreateOpen(false)}>
          <NoteForm onCancel={() => setIsCreateOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
