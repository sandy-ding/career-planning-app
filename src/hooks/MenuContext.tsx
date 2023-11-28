import { Dispatch, SetStateAction, createContext } from "react";

export const MenuContext = createContext<{
  menu: string;
  setMenu: Dispatch<SetStateAction<string>>;
}>({ menu: "", setMenu: () => {} });
