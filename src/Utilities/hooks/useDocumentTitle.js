import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { DEFAULT_TITLE } from '@/constants';
import useComplianceChrome from '@/Utilities/hooks/useComplianceChrome';

export const useTitleEntity = (route, entityTitle) => {
  const location = useLocation();

  useEffect(() => {
    const title = entityTitle
      ? route.title.replace('$entityTitle', entityTitle)
      : route.defaultTitle;
    route.setTitle(title);
  }, [entityTitle, location, route]);
};

const useDocumentTitle = () => {
  const chrome = useComplianceChrome();

  return (title) => {
    chrome.updateDocumentTitle(title || DEFAULT_TITLE);
  };
};

export default useDocumentTitle;
