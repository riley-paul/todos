export const ACCENT_COLOR = "teal" as const;
export const LIST_SEPARATOR_ID = "hidden-list-separator";

export const getListUrl = (listId: string) =>
  `${window.location.origin}/todos/${listId}`;
