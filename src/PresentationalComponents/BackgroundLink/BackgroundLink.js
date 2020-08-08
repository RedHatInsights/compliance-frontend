import React from 'react';
import propTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

const BackgroundLink = ({ to, children }) => {
    const location = useLocation();

    return <Link
        to={{
            pathname: to,
            state: { background: location }
        }}>
        { children }
    </Link>;
};

BackgroundLink.propTypes = {
    to: propTypes.string.isRequired,
    children: propTypes.node
};

export default BackgroundLink;
