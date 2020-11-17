import React from 'react';
import propTypes from 'prop-types';
import { UnsupportedSSGVersion } from 'PresentationalComponents';

const SSGVersion = ({ profiles }) => (
    profiles.map((p) => (
        p.unsupported ? <UnsupportedSSGVersion>
            { p.ssgVersion }
        </UnsupportedSSGVersion> : p.ssgVersion
    )).filter((version) => (!!version)).reduce((prev, curr) => [prev, ', ', curr], [])
);

SSGVersion.propTypes = {
    profiles: propTypes.array
};

export default {
    SSGVersion
};
