import { useFlagsStatus } from '@unleash/proxy-client-react';

const useUnleashFlagsReadyHcc = () => {
  const { flagsReady } = useFlagsStatus();

  return flagsReady;
};

export default useUnleashFlagsReadyHcc;
