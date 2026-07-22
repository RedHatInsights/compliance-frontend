/**
 * Foreman host-details Compliance tab URL (IoP).
 *
 *  @param   {string} displayName Host name as shown in Foreman
 *  @returns {string}             Absolute path + hash for top-window navigation
 */
export const getForemanHostComplianceHref = (displayName = '') =>
  `/new/hosts/${displayName}#/Compliance`;
