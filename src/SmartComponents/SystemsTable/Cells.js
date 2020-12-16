import React from 'react';
import propTypes from 'prop-types';
import { UnsupportedSSGVersion } from 'PresentationalComponents';

const SSGVersion = ({ profile }) => (
    profile.supported && profile.ssgVersion ||
    <UnsupportedSSGVersion messageVariant='singular'>
        { profile.ssgVersion }
    </UnsupportedSSGVersion>
);

SSGVersion.propTypes = {
    profile: propTypes.object
};

export default {
    SSGVersion
};
