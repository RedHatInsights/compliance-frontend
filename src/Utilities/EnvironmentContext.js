import { createContext, useContext } from 'react';

const noop = () => {};
const rejectedPromise = () => Promise.reject(new Error('Not supported'));

export const defaultEnvironment = {
  runtime: 'hcc',
  isIop: false,
  isHcc: true,
  hasChrome: false,
  authorizationProvider: 'rbac',
  isKesselEnabled: false,
  updateDocumentTitle: (title) => {
    document.title = title;
  },
  hideGlobalFilter: noop,
  requestPdf: rejectedPromise,
  logout: noop,
};

export const EnvironmentContext = createContext(defaultEnvironment);

export const useEnvironment = () => useContext(EnvironmentContext);
