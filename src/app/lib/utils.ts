import { type ClassValue, clsx } from "clsx";
import type React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mergeRefs<T = any>(
  refs: Array<
    React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null
  >,
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

export const focusInputAtEnd = (inputElement: HTMLTextAreaElement | null) => {
  if (inputElement) {
    inputElement.focus();
    const length = inputElement.value.length;
    inputElement.setSelectionRange(length, length);
  }
};

export const resizeTextArea = (inputElement: HTMLTextAreaElement | null) => {
  if (inputElement) {
    inputElement.style.height = "auto";
    inputElement.style.height = `${inputElement.scrollHeight}px`;
  }
};

export const slugToTitle = (slug: string) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getIsTyping = () =>
  document.activeElement?.tagName === "INPUT" ||
  document.activeElement?.tagName === "TEXTAREA" ||
  // @ts-expect-error
  document.activeElement?.isContentEditable;

export const sortByOrder = <T extends { id: string }>(
  items: T[],
  order: Record<string, number>,
) => {
  return items.slice().sort((a, b) => {
    const orderA = order[a.id] ?? Number.MAX_SAFE_INTEGER;
    const orderB = order[b.id] ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });
};
