import {
  useDispatch,
  useSelector,
  useStore,
  type TypedUseSelectorHook,
} from "react-redux";
import { type Store } from "redux";

import type { AppDispatch, RootState } from "../store";

// Use instead of plain `useDispatch`
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

// Use instead of plain `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Use instead of plain `useStore`
export const useAppStore = (): Store<RootState> => useStore<RootState>();
