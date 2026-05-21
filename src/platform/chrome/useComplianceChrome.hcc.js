import { useMemo } from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

/**
 * HCC build: Insights chrome via `useChrome`, with safe optional calls.
 */
export function useComplianceChrome() {
  const chrome = useChrome();

  return useMemo(
    () => ({
      hideGlobalFilter: (hide) => chrome?.hideGlobalFilter?.(hide),
      updateDocumentTitle: (title) => chrome?.updateDocumentTitle?.(title),
      requestPdf: (options) => chrome?.requestPdf?.(options),
      auth: chrome?.auth,
    }),
    [chrome],
  );
}
