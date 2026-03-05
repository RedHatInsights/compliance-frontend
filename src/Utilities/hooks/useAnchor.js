import { useLocation } from 'react-router-dom';

const isCorrectTabHash = (hash) =>
  hash && hash.length > 1 && !hash.replace('#', '').includes('=');

const lastTabByPath = {};

export const useAnchor = (defaultAnchor = '') => {
  const { pathname, hash } = useLocation();
  const raw = hash && hash.length > 0 ? hash.replace('#', '') : '';
  if (isCorrectTabHash(hash)) lastTabByPath[pathname] = raw;
  return isCorrectTabHash(hash)
    ? raw
    : (lastTabByPath[pathname] ?? defaultAnchor.replace('#', ''));
};

export default useAnchor;
