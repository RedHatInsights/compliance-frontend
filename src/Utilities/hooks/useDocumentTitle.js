import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

import { DEFAULT_TITLE } from '@/constants';

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
  const chrome = useChrome();

  return (title) => {
    chrome.updateDocumentTitle(title || DEFAULT_TITLE);
  };
};

export default useDocumentTitle;
