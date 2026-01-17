// components / NoteItem / NoteItem.tsx
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

      <div className={css.actions}>
        {/* View details — ОБОВʼЯЗКОВО перед Delete */}
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
