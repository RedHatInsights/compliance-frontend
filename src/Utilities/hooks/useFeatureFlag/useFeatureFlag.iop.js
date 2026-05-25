import { getIopStaticFeatureFlag } from '@/config/iopStaticFeatureFlags';

const useFeatureFlag = (flag) => getIopStaticFeatureFlag(flag);

export default useFeatureFlag;
