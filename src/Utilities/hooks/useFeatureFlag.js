import { getAppConfig } from '@/config/appConfig';
import { getIopStaticFeatureFlag } from '@/config/iopStaticFeatureFlags';
import { useFlag, useFlagsStatus } from '@unleash/proxy-client-react';

export default (flag) => {
  const { features } = getAppConfig();

  if (features.staticUnleashFlags) {
    return getIopStaticFeatureFlag(flag);
  }

  const { flagsReady } = useFlagsStatus();
  const isFlagEnabled = useFlag(flag);
  return flagsReady ? isFlagEnabled : undefined;
};
