import axios, { AxiosHeaders } from 'axios';

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
    return undefined;
  }
};

export const withForemanCsrf = (config) => {
  const method = (config.method || 'get').toLowerCase();
  if (!WRITE_METHODS.includes(method)) {
    return config;
  }

  let target;
  try {
    target = new URL(axios.getUri(config), window.location.origin);
  } catch {
    return config;
  }

  if (target.origin !== window.location.origin) return config;

  const token = getForemanCsrfToken();
  if (!token) return config;

  const headers = AxiosHeaders.from(config.headers);
  headers.set('X-CSRF-Token', token, false);
  return { ...config, headers };
};
