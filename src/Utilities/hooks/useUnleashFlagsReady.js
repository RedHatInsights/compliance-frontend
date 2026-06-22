import { useFlagsStatus } from '@unleash/proxy-client-react';

import { getAppConfig } from '@/config/appConfig';

const useUnleashFlagsReady = () => {
  const { flagsReady } = useFlagsStatus();

  if (!getAppConfig().features.unleash) {
    return true;
  }

  return flagsReady;
};

export default useUnleashFlagsReady;
