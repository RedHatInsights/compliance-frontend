import { Component } from 'react';
import propTypes from 'prop-types';

class ErrorPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { error } = this.props;
        if (error.networkError.statusCode === 401) {
            window.insights.chrome.auth.logout();
        }

        return 'Oops! There was an error loading Compliance data. If you need to contact ' +
            'Red Hat Support about this, this is the exact error: ' +
            error.networkError.statusCode + ' ' + error;
    }
}

ErrorPage.propTypes = {
    error: propTypes.object
};

export default ErrorPage;
