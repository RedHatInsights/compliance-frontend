import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';

import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import EnvironmentProvider from 'Utilities/EnvironmentProvider';

import CompliancePolicies from './CompliancePolicies';
import '../../App.scss';

const CompliancePoliciesIOP = ({ basename }) => (
  <EnvironmentProvider runtime="iop">
    <NotificationsProvider>
      <BrowserRouter basename={basename}>
        <CompliancePolicies />
      </BrowserRouter>
    </NotificationsProvider>
  </EnvironmentProvider>
);

CompliancePoliciesIOP.propTypes = {
  basename: PropTypes.string,
};

export default CompliancePoliciesIOP;
