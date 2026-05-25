import { createRoot } from 'react-dom/client';
import { jsx } from 'react/jsx-runtime';

import IopComplianceRoot from './IopComplianceRoot';
import { ensureChromeRbacBridge } from '@/Utilities/ensureChromeRbacBridge';

let activeRoot = null;

const mountComplianceRoot = (node) => {
  ensureChromeRbacBridge();
  activeRoot = createRoot(node);
  activeRoot.render(jsx(IopComplianceRoot, {}));
};

const unmountComplianceRoot = () => {
  if (activeRoot) {
    activeRoot.unmount();
    activeRoot = null;
  }
};

/**
 * IoP federated entry: Foreman (React 16) renders this shell;
 * IopComplianceRoot is mounted with createRoot so Compliance runs on React 18.
 *
 *  @returns {import('react').ReactElement} mount shell div
 */
const IopComplianceMount = () =>
  jsx('div', {
    className: 'compliance-iop-root',
    ref: (node) => {
      if (node) {
        mountComplianceRoot(node);
      } else {
        unmountComplianceRoot();
      }
    },
  });

export default IopComplianceMount;
