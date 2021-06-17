class ApiClient {
  DEFAULT_API_HEADERS = {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/json',
  };

  constructor(options = {}) {
    this.apiBase = options.apiBase || '/api';
    this.path = options.path || '';
    this.authenticate = options.authenticate || (() => Promise.resolve({}));
    this.onUnauthorised = options.onUnauthorised || (() => Promise.resolve({}));
    this.defaultHeaders = options.headers || this.DEFAULT_API_HEADERS;
  }

  async request(path, apiProps, method, options = {}) {
    return await this.callAuthenticate()
      .then(() => this.fetch(path, apiProps, method, options))
      .then(this.checkForEmptyResponse)
      .then((response) => this.checkForErrors(response, options))
      .then((response) => response.json())
      .catch(this.finalCatch);
  }

  finalCatch(promise) {
    if (promise.errors === undefined) {
      return Promise.reject({ title: 'Error parsing' });
    } else {
      return Promise.reject({ ...promise });
    }
  }

  fetch(path, apiProps, method, options) {
    let params = {
      method: method || 'get',
      headers: this.defaultHeaders,
      credentials: 'include',
    };
    const fullPath = `${this.apiBase}${this.path ? this.path : ''}${
      path ? path : ''
    }`;
    let url = new URL(fullPath, window.location.origin);
    if (options.params) {
      const params = Object.keys(options.params)
        .map(
          (key) =>
            encodeURIComponent(key) +
            '=' +
            encodeURIComponent(options.params[key])
        )
        .join('&');
      url.search = new URLSearchParams(params);
    }

    if (apiProps) {
      params.body = JSON.stringify(apiProps);
    }

    return fetch(url, params);
  }

  checkForEmptyResponse(response) {
    return response.status === 204 ? { json: () => ({}) } : response;
  }

  checkForErrors(response, options = {}) {
    if (response.status === 404 && options.ignore404) {
      return { json: () => ({}) };
    }

    if (response.status === 401) {
      return this.onUnauthorised();
    }

    const responseCloneJson = response.clone
      ? response.clone().json()
      : response;

    if (response.status === 422) {
      return responseCloneJson.then((json) =>
        Promise.reject({ ...json, title: 'Validation error' })
      );
    }

    if (response.status >= 400 && response.status <= 600) {
      return responseCloneJson.then((json) => Promise.reject(json.errors[0]));
    }

    return response;
  }

  callAuthenticate() {
    return Promise.resolve(this.authenticate() || true);
  }

  create(path, apiProps) {
    return this.request(path, apiProps, 'post');
  }

  update(path, apiProps) {
    return this.request(path, apiProps, 'put');
  }

  get(path, options = {}) {
    return this.request(path, null, 'get', options);
  }

  destroy(path) {
    return this.request(path, null, 'delete');
  }
}

export default ApiClient;
