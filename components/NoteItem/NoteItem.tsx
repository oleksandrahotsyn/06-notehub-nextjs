import Link from "next/link";
import type { Note } from "@/types/note";
import css from "./NoteItem.module.css";

type NoteItemProps = {
  note: Note;
  onDelete: (id: string) => void;
};

export default function NoteItem({ note, onDelete }: NoteItemProps) {
  return (
    <li className={css.item}>
      <h3 className={css.title}>{note.title}</h3>
      <p className={css.content}>{note.content}</p>
      <div className={css.actions}>
        <p className={css.tag}>{note.tag}</p>

        <Link href={`/notes/${note.id}`} className={css.link}>
          View details
        </Link>

        <button
          type="button"
          onClick={() => onDelete(note.id)}
          className={css.delete}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
