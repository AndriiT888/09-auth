"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type { NoteTag } from "@/types/note";
import { createNote } from "@/lib/api";
import css from "./NoteForm.module.css";
import useNoteStore from "@/lib/store/noteStore";

interface NoteFormProps {
  onCancel?: () => void;
}

const tags: NoteTag[] = ["todo", "work", "personal", "meeting", "shopping", "other"];

export default function NoteForm({ onCancel }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((s) => s.draft);
  const setDraft = useNoteStore((s) => s.setDraft);
  const clearDraft = useNoteStore((s) => s.clearDraft);

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value } as Partial<typeof draft>);
  };

  const handleSubmit = async (formData: FormData) => {
    const title = String(formData.get("title") ?? "");
    const content = String(formData.get("content") ?? "");
    const tag = (formData.get("tag") as NoteTag) ?? "Todo";

    await createMutation.mutateAsync({ title, content, tag });
    clearDraft();
    router.back();
  };

  return (
    <form className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          required
          minLength={3}
          maxLength={50}
          value={draft.title}
          onChange={handleChange}
        />
        <span className={css.error}></span>
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          maxLength={500}
          value={draft.content}
          onChange={handleChange}
        />
        <span className={css.error}></span>
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          required
          value={draft.tag}
          onChange={handleChange}
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <span className={css.error}></span>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => (onCancel ? onCancel() : router.back())}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          formAction={handleSubmit}
          disabled={createMutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
}