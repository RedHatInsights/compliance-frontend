import { useFlagsStatus } from '@unleash/proxy-client-react';

export default function useUnleashFlagsReady() {
  return useFlagsStatus().flagsReady;
}
