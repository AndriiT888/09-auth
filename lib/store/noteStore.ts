import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NoteTag } from "@/types/note";

export const initialDraft = {
  title: "",
  content: "",
  tag: "Todo" as NoteTag,
};

type Draft = typeof initialDraft;

interface NoteState {
  draft: Draft;
  setDraft: (note: Partial<Draft>) => void;
  clearDraft: () => void;
}

const useNoteStore = create<NoteState>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({
          draft: { ...state.draft, ...note },
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft",
    }
  )
);

export default useNoteStore;