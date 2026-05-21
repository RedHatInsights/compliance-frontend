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

/**
 * IoP build: chrome from Scalprum bridge (no `useChrome` — separate React 18 root).
 */
export function useComplianceChrome() {
  const rawChrome = typeof window !== 'undefined' ? window.insights?.chrome : undefined;

  return useMemo(() => toComplianceChrome(rawChrome), [rawChrome]);
}
