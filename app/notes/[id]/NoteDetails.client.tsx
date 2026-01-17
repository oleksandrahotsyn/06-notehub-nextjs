"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getSingleNote } from "@/lib/api";

const NoteDetailsClient = () => {
  const { id } = useParams<{ id: string }>();
  const noteId = Number(id);
  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => getSingleNote(noteId),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;

  if (error || !note) return <p>Some error..</p>;

  return (
    <div>
      <div>
        <div>
          <h2>{note.title}</h2>
          <button>Edit note</button>
        </div>
        <p>{note.content}</p>
        <p>{note.createdAt}</p>
      </div>
    </div>
  );
};

export default NoteDetailsClient;
