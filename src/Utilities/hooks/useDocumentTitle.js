import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

import { DEFAULT_TITLE, DEFAULT_TITLE_SUFFIX } from '@/constants';

const defaultTitleSuffixed = (title) => `${title}${DEFAULT_TITLE_SUFFIX}`;

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
    chrome.updateDocumentTitle(defaultTitleSuffixed(title || DEFAULT_TITLE));
  };
};

export default useDocumentTitle;
