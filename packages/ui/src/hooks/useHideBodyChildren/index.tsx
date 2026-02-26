import { useEffect, useRef } from 'react';

import type { UseHideBodyChildrenType } from './type';

/**
 * Hide or show all elements at the same level as the current modal
 * @param {HTMLDivElement | null} modal is the current modal
 * @param {boolean} modalAccessible indicates if modal is visible or not
 */
const useHideBodyChildren = ({
  modal,
  modalAccessible,
  closeButton,
  customContainer,
}: UseHideBodyChildrenType): void => {
  const openModalButtonRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null),
    childrenToHideRef = useRef<Array<Element>>([]);

  useEffect(() => {
    if (modal) {
      childrenToHideRef.current = modalAccessible
        ? Array.from((customContainer || document.body).children).filter(
            (el) => el !== modal && el.getAttribute('aria-hidden') !== 'true',
          )
        : childrenToHideRef.current;

      if (modalAccessible) {
        modal.removeAttribute('hidden');
        modal.removeAttribute('aria-hidden');

        for (const child of childrenToHideRef.current) {
          child.setAttribute('aria-hidden', 'true');
        }

        openModalButtonRef.current = document.activeElement as
          | HTMLButtonElement
          | HTMLAnchorElement
          | null;

        if (closeButton) {
          closeButton.focus();
        }
      } else {
        for (const element of childrenToHideRef.current) {
          element.removeAttribute('aria-hidden');
        }

        // Give focus to opening modal button
        openModalButtonRef?.current?.focus();
      }
    }
  }, [modalAccessible, modal, closeButton, customContainer]);
};

export default useHideBodyChildren;
