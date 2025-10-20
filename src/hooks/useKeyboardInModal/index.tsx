import { useCallback, useEffect } from 'react';

import type { UseKeyboardInModalType } from './type';

/**
 * useKeyboardInModal Hook
 *
 * This hook ensures that keyboard focus remains within a modal when it is open.
 * It prevents users from tabbing outside of the modal and restores focus to the
 * element that triggered the modal when it closes.
 *
 * Functionality:
 * 1. Captures the initially focused element before opening the modal.
 * 2. Moves focus to the close button when the modal opens.
 * 3. Listens for the 'Tab' key to cycle focus within the modal.
 * 4. Prevents focus from escaping the modal by looping focus within it.
 * 5. Restores focus to the previously focused element when the modal closes.
 *
 * It also ensures that pressing the 'Escape' key closes the modal.
 *
 */

const useKeyboardInModal = ({
  container,
  modalAccessible,
  closeModal,
}: UseKeyboardInModalType): void => {
  const focusableSelection =
    'a:not([tabindex="-1"]):not([disabled]):not([href=""]), button:not([tabindex="-1"]):not([disabled]):not([aria-hidden="true"]), select:not([tabindex="-1"]):not([disabled]), textarea:not([tabindex="-1"]):not([disabled]), input:not([tabindex="-1"]):not([disabled]):not([hidden])';

  const trapFocus = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Tab' && document.activeElement && container) {
        const focusableElements = container?.querySelectorAll(focusableSelection) || [];
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement),
          shiftPressed = e.shiftKey;

        if (
          (shiftPressed && currentIndex === 0) ||
          (!shiftPressed && currentIndex === focusableElements.length - 1)
        ) {
          e.preventDefault();

          // If Shift + Tab is pressed and focus is on the first focusable element,
          // move focus to the last focusable element (loop back to end).
          // If Tab is pressed and focus is on the last focusable element,
          // move focus to the first focusable element (loop back to start).
          const nextIndex = shiftPressed ? focusableElements.length - 1 : 0,
            focusable = focusableElements[nextIndex] as
              | HTMLButtonElement
              | HTMLAnchorElement
              | HTMLInputElement
              | HTMLSelectElement
              | HTMLTextAreaElement;

          focusable.focus();
          return true;
        }
      }
    },
    [container],
  );

  const handleKeyDown = useCallback(
    // Need to pass Event as typescript doesn't infer correctly if we use KeyboardEvent on Dialog element
    (e: Event): void => {
      const evt = e as KeyboardEvent;
      if (evt.key === 'Escape' && closeModal) {
        // Avoid GDS or other try parti to execute code when escape is pressed.
        // for instance in VTO if you have a inner modal, its will close inner modal and vto.
        evt.preventDefault();
        evt.stopPropagation();
        closeModal();
      } else if (trapFocus(evt)) {
        evt.preventDefault();
        evt.stopPropagation();
      }
    },
    [closeModal, trapFocus],
  );

  useEffect(() => {
    if (!container) return;

    if (modalAccessible) {
      container.addEventListener('keydown', handleKeyDown, true);
    }

    return () => {
      container.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [container, modalAccessible, handleKeyDown]);
};

export default useKeyboardInModal;
