import React from 'react';
import propTypes from 'prop-types';
import { UnsupportedSSGVersion } from 'PresentationalComponents';

const SSGVersion = ({ supported, ssgVersion }) => {
    ssgVersion ||= 'Not available';
    return supported ? ssgVersion :
        <UnsupportedSSGVersion messageVariant='singular'>
            { ssgVersion }
        </UnsupportedSSGVersion>;
};

SSGVersion.propTypes = {
    supported: propTypes.bool,
    ssgVersion: propTypes.string
};

export default {
    SSGVersion
};
