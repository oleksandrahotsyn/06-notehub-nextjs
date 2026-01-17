"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import css from "./NotesPage.module.css";
import { fetchNotes, NotesResponse } from "@/lib/api";

type NotesClientProps = {
  initialPage: number;
  initialSearch: string;
  initialData: NotesResponse;
};

export default function NotesClient({
  initialPage,
  initialSearch,
  initialData,
}: NotesClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [debSearchTerm] = useDebounce(searchTerm, 1000);
  const perPage = 12;

  const { data } = useQuery<NotesResponse>({
    queryKey: ["notes", debSearchTerm, currentPage],
    queryFn: () => fetchNotes(currentPage, debSearchTerm, perPage),
    placeholderData: keepPreviousData,
    initialData:
      currentPage === initialPage && debSearchTerm === initialSearch
        ? initialData
        : undefined,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSearchChange = (newTerm: string) => {
    setSearchTerm(newTerm);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchTerm} onChange={handleSearchChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            pageCount={data.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {data && <NoteList notes={data.notes} />}
      {isModalOpen && <Modal onClose={closeModal} onSuccess={closeModal} />}
    </div>
  );
}
