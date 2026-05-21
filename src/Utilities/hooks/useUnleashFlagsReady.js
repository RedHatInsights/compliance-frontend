import { getAppConfig } from '@/config/appConfig';
import { useFlagsStatus } from '@unleash/proxy-client-react';

export default function useUnleashFlagsReady() {
  const appConfig = getAppConfig();
  if (!appConfig.features.unleash) {
    return true;
  }

  return useFlagsStatus().flagsReady;
}
