import useFeatureFlagHcc from './useFeatureFlag.hcc';
import useFeatureFlagIop from './useFeatureFlag.iop';

export default process.env.IOP === 'true'
  ? useFeatureFlagIop
  : useFeatureFlagHcc;
