export { default as prepareTreeTable } from './prepareTreeTable';
export { default as prepareRules } from './prepareRules';
export { default as skips } from './skips';

export const eventKey = ({ id, os_minor_version }) =>
  `tailoring-${id}-${os_minor_version}`;
