import { atomWithReducer } from "jotai/utils";
import type { AlertProps } from "./alert-system.types";

type State = {
  isOpen: boolean;
  data: AlertProps | undefined;
};

type Action = { type: "open"; data: AlertProps } | { type: "close" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "open":
      return {
        isOpen: true,
        data: action.data,
      };
    case "close":
      return {
        isOpen: false,
        data: undefined,
      };
    default:
      return state;
  }
};

const initialState: State = {
  isOpen: false,
  data: undefined,
};

export const alertSystemAtom = atomWithReducer<State, Action>(
  initialState,
  reducer
);
