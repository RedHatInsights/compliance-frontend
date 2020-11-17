import React from 'react';
import propTypes from 'prop-types';
import { SSGVersionWarning } from 'PresentationalComponents';
import joinComponents from 'Utilities/joinComponents';

const SSGVersion = ({ profiles }) => (
    joinComponents(profiles.map((p) => (
        p.ssgVersion && <SSGVersionWarning key={ `profile-ssg-${ p.id }` } supported={ p.supported }>
            { p.ssgVersion }
        </SSGVersionWarning>
    )).filter((version) => (!!version)), ', ')
);

SSGVersion.propTypes = {
    profiles: propTypes.array
};

export default {
    SSGVersion
};
