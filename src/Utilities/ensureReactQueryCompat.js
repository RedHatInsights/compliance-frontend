import React from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

// Workaround for IoP / Foreman which uses an older shared React (e.g. 16.x). TanStack needs React 18+ (`useSyncExternalStore` on the `react` package).
if (typeof React.useSyncExternalStore !== 'function') {
  React.useSyncExternalStore = useSyncExternalStore;
}
