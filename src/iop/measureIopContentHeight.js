export const measureIopContentHeight = () => {
  const main = document.querySelector('.pf-v6-c-page__main');

  if (!main) {
    return 0;
  }

  const box = main.getBoundingClientRect();
  const parentStyle = getComputedStyle(main.parentElement);
  const bottom =
    parseFloat(parentStyle.paddingBottom) +
    parseFloat(parentStyle.borderBottomWidth);

  return Math.ceil(box.top + main.scrollHeight + bottom);
};
