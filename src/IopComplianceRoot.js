import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import AppEntry from './AppEntry';

/**
 * Full Compliance tree for IoP. Rendered via createRoot in IopComplianceMount
 * so the app uses React 18 even when the IoP host provides React 16 in the MF share scope.
 *
 *  @returns {import('react').ReactElement} compliance app root
 */
const IopComplianceRoot = () => (
  <BrowserRouter basename="/foreman_rh_cloud">
    <AppEntry />
  </BrowserRouter>
);

export default IopComplianceRoot;
