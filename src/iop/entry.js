import { createRoot } from 'react-dom/client';
import React from 'react';

// HCC injects Patternfly via insights-chrome head snippets; IoP iframe has no chrome host.
import '@patternfly/patternfly/patternfly.scss';
import '@patternfly/patternfly/patternfly-addons.scss';
import '@patternfly/patternfly/utilities/Accessibility/accessibility.scss';
import '@patternfly/patternfly/utilities/Spacing/spacing.scss';
import '@patternfly/patternfly/patternfly-charts.scss';

import IopAppEntry from './IopAppEntry';
import './iopPage.scss';

const mountNode = document.getElementById('root');

if (mountNode) {
  createRoot(mountNode).render(<IopAppEntry environment="production" />);
}
