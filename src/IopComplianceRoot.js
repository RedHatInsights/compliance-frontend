import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import AppEntry from './AppEntry';

/**
 * Full Compliance tree for IoP. Rendered via `createRoot` in {@link IopComplianceMount}
 * so the app uses React 18 even when the IoP host provides React 16 in the MF share scope.
 */
const IopComplianceRoot = () => (
  <BrowserRouter basename="/foreman_rh_cloud">
    <AppEntry environment="production" />
  </BrowserRouter>
);

export default IopComplianceRoot;
