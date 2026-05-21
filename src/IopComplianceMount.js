import { createRoot } from 'react-dom/client';
import { jsx } from 'react/jsx-runtime';

import IopComplianceRoot from './IopComplianceRoot';
import { ensureChromeRbacBridge } from '@/platform/iop/ensureChromeRbacBridge';

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
 * Thin federated shell: no hooks from `react` (host MF share scope can be null here).
 * The real app runs in an isolated React 18 root via {@link IopComplianceRoot}.
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
