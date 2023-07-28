import { useLocation } from 'react-router-dom';

export const useAnchor = (defaultAnchor = '') => {
  const location = useLocation();
  const hash =
    location.hash && location.hash.length > 0 ? location.hash : undefined;
  return (hash || defaultAnchor).replace('#', '');
};

export default useAnchor;
