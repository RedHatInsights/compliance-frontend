import useCollection from 'Utilities/hooks/api/useCollection';
import { osMinorVersionFilter } from './constants';

const groupByMajorVersion = (versions = [], showFilter) => {
    const showVersion = (version) => {
        if (showFilter.length > 0) {
            return Array(showFilter).map(String).includes(String(version));
        } else {
            return true;
        }
    };

    return versions.reduce((acc, currentValue) => {
        if (showVersion(currentValue.osMajorVersion)) {
            acc[String(currentValue.osMajorVersion)] = [...new Set(
                [...acc[currentValue.osMajorVersion] || [], currentValue.osMinorVersion]
            )];
        }

        return acc;
    }, []);
};

export const useOsMinorVersionFilter = (showFilter) => {
    const { data: supportedSsgs } = useCollection('supported_ssgs', {
        type: 'supportedSsg',
        skip: !showFilter
    });

    return osMinorVersionFilter(groupByMajorVersion(supportedSsgs?.collection, showFilter));
};
