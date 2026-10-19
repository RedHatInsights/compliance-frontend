import { createRoot } from 'react-dom/client';
import React from 'react';

// Inventory table styling is in PF5
import '@patternfly/patternfly-v5/patternfly-no-globals.css';
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
