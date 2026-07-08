import { useFlag, useFlagsStatus } from '@unleash/proxy-client-react';

import { getAppConfig } from '@/config/appConfig';
import { getIopStaticFeatureFlag } from '@/config/iopStaticFeatureFlags';

export default (flag) => {
  if (!getAppConfig().features.unleash) {
    return getIopStaticFeatureFlag(flag);
  }

  const { flagsReady } = useFlagsStatus();
  const isFlagEnabled = useFlag(flag);

  return flagsReady ? isFlagEnabled : undefined;
};
