import React from 'react';
import ReactDOM from 'react-dom';
import logger from 'redux-logger';
import AppEntry from './AppEntry';

const DevAppEntry = () => <AppEntry logger={logger} />;

ReactDOM.render(<DevAppEntry />, document.getElementById('root'));

export default DevAppEntry;
