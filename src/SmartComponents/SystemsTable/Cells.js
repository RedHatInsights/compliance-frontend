import React from 'react';
import propTypes from 'prop-types';
import { UnsupportedSSGVersion } from 'PresentationalComponents';

const SSGVersion = ({ profile }) => (
    profile.supported && profile.ssg_version ||
    <UnsupportedSSGVersion messageVariant='singular'>
        { profile.ssg_version }
    </UnsupportedSSGVersion>
);

SSGVersion.propTypes = {
    profile: propTypes.object
};

export default {
    SSGVersion
};
