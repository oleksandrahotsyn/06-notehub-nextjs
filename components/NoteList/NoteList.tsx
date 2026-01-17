import type { Note } from "@/types/note";
import NoteItem from "../NoteItem/NoteItem";
import css from "./NoteList.module.css";

type NoteListProps = {
  notes: Note[];
  onDelete: (id: string) => void;
};

export default function NoteList({ notes, onDelete }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} onDelete={onDelete} />
      ))}
    </ul>
  );
}
