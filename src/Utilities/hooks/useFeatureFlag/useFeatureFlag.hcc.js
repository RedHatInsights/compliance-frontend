import { useFlag, useFlagsStatus } from '@unleash/proxy-client-react';

const useFeatureFlag = (flag) => {
  const { flagsReady } = useFlagsStatus();
  const isFlagEnabled = useFlag(flag);
  return flagsReady ? isFlagEnabled : undefined;
};

export default useFeatureFlag;
