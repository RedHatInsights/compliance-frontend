import { useMemo } from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import { buildAppConfig, readEnvTarget } from '@/config/appConfig';

import { adaptChrome } from './adaptChrome';

export function useComplianceChrome() {
  const rawChrome = useChrome();
  const envTarget = readEnvTarget();

  return useMemo(
    () => adaptChrome(rawChrome, buildAppConfig(envTarget)),
    [rawChrome, envTarget],
  );
}
