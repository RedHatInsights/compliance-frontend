import React from 'react';
import propTypes from 'prop-types';
import { Label } from '@patternfly/react-core';

const OperatingSystemBadge = ({ majorOsVersion }) => {
    const colorMap = {
        default: 'var(--pf-global--disabled-color--200)',
        7: 'cyan',
        8: 'purple'
    };
    const color = colorMap[majorOsVersion] || colorMap.default;

    return <Label { ...{ color } }>
        RHEL { majorOsVersion }
    </Label>;
};

OperatingSystemBadge.propTypes = {
    majorOsVersion: propTypes.string
};

export default OperatingSystemBadge;
