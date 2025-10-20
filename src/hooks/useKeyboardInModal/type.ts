export type UseKeyboardInModalType = {
  container: HTMLDivElement | HTMLDialogElement | null;
  modalAccessible: boolean;
  closeModal: () => void;
};
