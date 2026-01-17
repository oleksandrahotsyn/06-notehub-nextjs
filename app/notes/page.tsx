import css from "@/app/notes/NotesPage.module.css";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

const PER_PAGE = 12;

type NotesPageProps = {
  searchParams?: {
    page?: string;
    search?: string;
  };
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const page = Number(searchParams?.page ?? "1") || 1;
  const search = (searchParams?.search ?? "").trim();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", page, PER_PAGE, search],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
  });

  return (
    <div className={css.app}>
      <div className={css.toolbar}> </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient
          initialPage={page}
          initialSearch={search}
          perPage={PER_PAGE}
        />
      </HydrationBoundary>
    </div>
  );
}
