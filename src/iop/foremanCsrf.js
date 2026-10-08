import axios, { AxiosHeaders } from 'axios';
import { getAppConfig } from '@/config/appConfig';

const WRITE_METHODS = ['post', 'put', 'patch', 'delete'];

export const getForemanCsrfToken = (frame = window) => {
  try {
    const parent = frame.parent || frame;
    if (parent.location.origin !== frame.location.origin) return undefined;

    return (
      parent.document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content') || undefined
    );
  } catch {
    // A cross-origin parent cannot be read, and must not receive the token.
    return undefined;
  }
};

export const withForemanCsrf = (config) => {
  const appConfig = getAppConfig();
  const method = (config.method || 'get').toLowerCase();
  if (appConfig.envTarget !== 'iop' || !WRITE_METHODS.includes(method)) {
    return config;
  }

  let target;
  try {
    target = new URL(axios.getUri(config), window.location.origin);
  } catch {
    return config;
  }

  const proxyPath = appConfig.api.complianceBasePath;
  if (
    target.origin !== window.location.origin ||
    !(
      target.pathname === proxyPath ||
      target.pathname.startsWith(`${proxyPath}/`)
    )
  ) {
    return config;
  }

  const token = getForemanCsrfToken();
  if (!token) return config;

  const headers = AxiosHeaders.from(config.headers);
  headers.set('X-CSRF-Token', token, false);
  return { ...config, headers };
};
