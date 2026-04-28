import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { DEFAULT_TITLE } from '@/constants';
import { useEnvironment } from 'Utilities/EnvironmentProvider';

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
  const { updateDocumentTitle } = useEnvironment();

  return (title) => {
    updateDocumentTitle(title || DEFAULT_TITLE);
  };
};

export default useDocumentTitle;
