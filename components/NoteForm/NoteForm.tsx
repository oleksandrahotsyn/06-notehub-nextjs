import {
  useFormik,
  FormikProvider,
  ErrorMessage as FormikErrorMessage,
} from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../lib/api";
import toast from "react-hot-toast";

const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;

export interface NoteFormValues {
  title: string;
  content: string;
  tag: (typeof tags)[number];
}

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.mixed<(typeof tags)[number]>()
    .oneOf(tags, "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (values: NoteFormValues) =>
      createNote({
        title: values.title.trim(),
        content: values.content.trim(),
        tag: values.tag,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created");
      onCancel();
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  const formik = useFormik<NoteFormValues>({
    initialValues: {
      title: "",
      content: "",
      tag: "Todo",
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        await createMutation.mutateAsync(values);
        helpers.resetForm();
      } catch {}
    },
  });

  return (
    <FormikProvider value={formik}>
      <form className={css.form} onSubmit={formik.handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            className={css.input}
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.title && (
            <FormikErrorMessage
              name="title"
              component="span"
              className={css.error}
            />
          )}
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.content && (
            <FormikErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          )}
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <select
            id="tag"
            name="tag"
            className={css.select}
            value={formik.values.tag}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </select>
          {formik.touched.tag && (
            <FormikErrorMessage
              name="tag"
              component="span"
              className={css.error}
            />
          )}
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={onCancel}
            disabled={createMutation.isPending}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={css.submitButton}
            disabled={createMutation.isPending || !formik.isValid}
          >
            Create note
          </button>
        </div>
      </form>
    </FormikProvider>
  );
}
