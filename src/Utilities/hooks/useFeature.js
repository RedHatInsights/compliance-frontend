import { features } from '@/constants';
import { useLocation, useHistory } from 'react-router-dom';
export const LOCAL_STORE_FEATURE_PREFIX = 'insights:compliance';

const setFeatureFlag = (featureValue, feature) => {
    const value = featureValue === 'enable';

    if (!value) {
        console.log(`Removing feature setting of ${feature}`);
        localStorage.removeItem(`${LOCAL_STORE_FEATURE_PREFIX}:${feature}`);
    } else {
        console.log(`Setting feature value for ${feature} to ${value}`);
        localStorage.setItem(`${LOCAL_STORE_FEATURE_PREFIX}:${feature}`, value);
    }
};

// Allows setting feature flag values via ?feature|(enable/disable)
export const useSetFlagsFromUrl = () => {
    const { search, pathName: path } = useLocation();
    const history = useHistory();
    if (!search) {
        return;
    }

    const urlParams = new URLSearchParams(search);
    urlParams.forEach(setFeatureFlag);

    history.push(path);
};

const getFlagValue = (feature) => {
    const defaultValue = features[feature];
    const storedValue = !!localStorage.getItem(`${LOCAL_STORE_FEATURE_PREFIX}:${feature}`);

    return storedValue || defaultValue;
};

// A hook to query feature values
const useFeature = (feature) => {
    if (!feature) {
        return;
    }

    const featureEnabled = getFlagValue(feature);

    console.log(`Feature ${feature} is set to ${featureEnabled}`);
    return featureEnabled;
};

export default useFeature;
