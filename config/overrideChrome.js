export const useChrome = () => ({
  updateDocumentTitle: () => undefined,
  isBeta: () => false,
  getBundle: () => 'insights',
  getApp: () => 'compliance',
  isProd: () => false,
});

export default useChrome;
