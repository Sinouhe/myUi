export const handleAriaDisabled = ({
  isDisabled,
  initialTabIndex = 0,
}: {
  isDisabled: boolean;
  initialTabIndex?: number;
}): {
  'aria-disabled': boolean;
  tabIndex: number;
} => {
  return {
    'aria-disabled': isDisabled,
    tabIndex: isDisabled ? -1 : initialTabIndex,
  };
};

export const manageChildrenTabIndex = ({
  container,
  isActive,
}: {
  container: HTMLElement;
  isActive?: boolean;
}): void => {
  const interactiveElements = [
    ...container.querySelectorAll(
      `a, button, input, select, textarea, canvas, ${
        isActive ? '[tabindex=”0”]' : '[tabindex=”-1”]'
      }`,
    ),
  ];
  interactiveElements.forEach((element) => {
    if (isActive) {
      element.setAttribute('tabindex', '0');
    } else {
      element.setAttribute('tabindex', '-1');
    }
  });
};
