import React from 'react';
import ReactDOM from 'react-dom';
import logger from 'redux-logger';
import AppEntry from './AppEntry';
ReactDOM.render(
    <AppEntry logger={logger} />,
    document.getElementById('root')
);
