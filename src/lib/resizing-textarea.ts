export const focusInputAtEnd = (inputElement: HTMLTextAreaElement) => {
  if (inputElement) {
    inputElement.focus();
    const length = inputElement.value.length;
    inputElement.setSelectionRange(length, length);
  }
};

export const resizeTextArea = (inputElement: HTMLTextAreaElement) => {
  if (inputElement) {
    inputElement.style.height = "auto";
    inputElement.style.height = `${inputElement.scrollHeight}px`;
  }
};
