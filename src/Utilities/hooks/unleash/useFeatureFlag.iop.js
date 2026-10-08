import { getIopStaticFeatureFlag } from '@/config/iopStaticFeatureFlags';

const useFeatureFlagIop = (flag) => getIopStaticFeatureFlag(flag);

export default useFeatureFlagIop;
