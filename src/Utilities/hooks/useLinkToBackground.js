import { useLocation } from 'react-router-dom';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

export const useLinkToBackground = (fallbackRoute) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (args) => {
    const background = location?.state?.background;

    navigate({
      pathname: background ? background.pathname : fallbackRoute,
      hash: background ? background.hash : undefined,
      ...args,
    });
  };
};

export default useLinkToBackground;
