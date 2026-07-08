import { useFlagsStatus } from '@unleash/proxy-client-react';

import { getAppConfig } from '@/config/appConfig';

const useUnleashFlagsReady = () => {
  if (!getAppConfig().features.unleash) {
    return true;
  }

  const { flagsReady } = useFlagsStatus();

  return flagsReady;
};

export default useUnleashFlagsReady;
