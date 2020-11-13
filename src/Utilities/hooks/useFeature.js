import { useContext } from 'react';
import { EnabledFeaturesContext } from '../EnabledFeatures';

// A hook to query feature values
const useFeature = (feature) => {
    const enabledFeatures = useContext(EnabledFeaturesContext);
    return enabledFeatures[feature];
};

export default useFeature;

