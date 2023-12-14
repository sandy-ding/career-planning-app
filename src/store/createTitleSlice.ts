import { StateCreator } from "zustand";

export interface TitleSlice {
  title: string;
  setTitle: (title: string) => void;
}

export const createTitleSlice: StateCreator<TitleSlice, [], [], TitleSlice> = (
  set
) => ({
  title: "",
  setTitle: (title: string) => set(() => ({ title })),
});
