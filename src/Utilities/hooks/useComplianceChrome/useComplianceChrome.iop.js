/* eslint-disable rulesdir/no-chrome-api-call-from-window -- IoP reads Scalprum chrome from window.insights */

import { useMemo } from 'react';

function toComplianceChrome(rawChrome = {}) {
  return {
    hideGlobalFilter: () => undefined,
    updateDocumentTitle: (title) => {
      if (typeof rawChrome?.updateDocumentTitle === 'function') {
        rawChrome.updateDocumentTitle(title);
        return;
      }
      if (typeof document !== 'undefined' && title) {
        document.title = title;
      }
    },
    requestPdf: () => undefined,
    auth: rawChrome?.auth,
  };
}

const useComplianceChrome = () => {
  const rawChrome =
    typeof window !== 'undefined' ? window.insights?.chrome : undefined;

  return useMemo(() => toComplianceChrome(rawChrome), [rawChrome]);
};

export default useComplianceChrome;
