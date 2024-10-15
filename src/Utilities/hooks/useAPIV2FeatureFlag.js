import useFeatureFlag from './useFeatureFlag';

const useAPIV2FeatureFlag = () => {
  const unleashFlag = useFeatureFlag('compliance-api-v2');
  const localFlag =
    localStorage.getItem('insights:compliance:apiv2') === 'true';

  return localFlag || unleashFlag;
};

export default useAPIV2FeatureFlag;
