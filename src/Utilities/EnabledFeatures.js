import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { features } from '@/constants';

const LOCAL_STORE_FEATURE_PREFIX = 'insights:compliance';

export const EnabledFeaturesContext = React.createContext(features);

export const getStoredFeatures = () => {
    let savedState = { ...features };
    Object.keys(features).forEach((feature) => {
        let stored = localStorage.getItem(`${LOCAL_STORE_FEATURE_PREFIX}:${feature}`);
        if (stored) {
            savedState[feature] = !!stored;
        }
    });
    return savedState;
};

const storeFeatureFlag = (feature, value) => {
    if (!value) {
        console.log(`Removing feature setting of ${feature}`);
        localStorage.removeItem(`${LOCAL_STORE_FEATURE_PREFIX}:${feature}`);
    } else {
        console.log(`Setting feature value for ${feature} to ${value}`);
        localStorage.setItem(`${LOCAL_STORE_FEATURE_PREFIX}:${feature}`, value);
    }
};

export const EnabledFeatures = ({ children }) => {
    const [enabledFeatures, setEnabledFeatures] = useState(getStoredFeatures);
    const { search } = useLocation();

    useEffect(() => {
        let setFeatures = {};

        const urlParams = new URLSearchParams(search || '');
        urlParams.forEach((value, feature) => {
            let featureEnabled = value === 'enable';
            if (features[feature] === undefined && !featureEnabled) {
                return;
            }

            storeFeatureFlag(feature, featureEnabled);
            setFeatures[feature] = featureEnabled;
        });

        if (Object.keys(setFeatures).length > 0) {
            setEnabledFeatures({ ...enabledFeatures, ...setFeatures });
        }
    }, [search]);

    return (
        <EnabledFeaturesContext.Provider value={enabledFeatures}>
            { children }
        </EnabledFeaturesContext.Provider>
    );
};

EnabledFeatures.propTypes = {
    children: propTypes.node
};

export default EnabledFeatures;
