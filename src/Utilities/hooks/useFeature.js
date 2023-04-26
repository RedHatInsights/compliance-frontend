import { useEffect, useMemo } from 'react';
import { features } from '@/constants';
import { useLocation, useNavigate } from 'react-router-dom';
export const LOCAL_STORE_FEATURE_PREFIX = 'insights:compliance';

const getFlagValue = (feature) => {
  const defaultValue = features[feature];
  const storedValue = !!localStorage.getItem(
    `${LOCAL_STORE_FEATURE_PREFIX}:${feature}`
  );

  return storedValue || defaultValue;
};

const setFeatureFlag = (featureValue, feature) => {
  const value = featureValue === 'enable' || featureValue === 'true';
  const debugFeatures = getFlagValue('debugFeatures');

  if (!value) {
    if (debugFeatures) {
      console.log(`Removing feature setting of ${feature}`);
    }
    localStorage.removeItem(`${LOCAL_STORE_FEATURE_PREFIX}:${feature}`);
  } else {
    if (debugFeatures) {
      console.log(`Setting feature value for ${feature} to ${value}`);
    }
    localStorage.setItem(`${LOCAL_STORE_FEATURE_PREFIX}:${feature}`, value);
  }
};

// Allows setting feature flag values via ?feature|(enable/disable)
export const useSetFlagsFromUrl = () => {
  const { search, pathName: path } = useLocation();
  const navigate = useNavigate();
  if (!search) {
    return;
  }

  const urlParams = new URLSearchParams(search);
  urlParams.forEach(setFeatureFlag);

  navigate(path);
};

// A hook to query feature values
const useFeature = (feature) => {
  const debugFeatures = useMemo(() => getFlagValue('debugFeatures'), []);
  const featureEnabled = useMemo(() => getFlagValue(feature), [feature]);

  useEffect(() => {
    if (debugFeatures) {
      console.log(`Feature ${feature} is set to ${featureEnabled}`);
    }
  }, [feature, featureEnabled, debugFeatures]);

  return !feature ? undefined : featureEnabled;
};

export default useFeature;
