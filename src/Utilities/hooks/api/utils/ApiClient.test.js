import { default as ApiClientClass } from './ApiClient';

const ApiClient = new ApiClientClass();

const objectResolver = Promise.resolve({});
const mockFetchPromise = Promise.resolve({
  ok: true,
  json: () => objectResolver,
});
const fetchSpy = jest.fn(() => mockFetchPromise);

describe('request', () => {
  beforeAll(() => {
    window.insights = {
      chrome: {
        auth: {
          getUser: jest.fn(() => objectResolver),
          logout: jest.fn(() => objectResolver),
        },
      },
    };
    window.fetch = fetchSpy;
  });

  it('calls fetch', async () => {
    const result = await ApiClient.request('/path', {}, 'get');
    expect(result).toMatchObject(await objectResolver);
    expect(window.fetch).toHaveBeenCalled();
  });

  afterAll(() => {
    window.fetch.mockClear();
  });
});

describe('checkForErrors', () => {
  const errors = {
    errors: [
      {
        title: 'Not found',
        detail: 'Record not found',
      },
    ],
  };

  it('returns the response if status is not between 400 and <600', async () => {
    const response = {
      status: 200,
      body: 'OK',
      json: jest.fn(() => Promise.resolve(errors)),
    };
    response.clone = jest.fn(() => response);
    await expect(ApiClient.checkForErrors(response)).toEqual(response);
  });

  it('rejects with first error if status is between 400 and <600', async () => {
    const response = {
      status: 404,
      body: 'Not found',
      json: jest.fn(() => Promise.resolve(errors)),
    };
    response.clone = jest.fn(() => response);

    await expect(ApiClient.checkForErrors(response)).rejects.toEqual(
      errors.errors[0]
    );
    expect(response.json).toHaveBeenCalled();
  });

  it('rejects with the all errors if status is 422', async () => {
    const response = {
      status: 422,
      body: 'Unprocessable entity',
      json: jest.fn(() => Promise.resolve(errors)),
    };
    response.clone = jest.fn(() => response);
    const rejection = { ...errors, title: 'Validation error' };

    await expect(ApiClient.checkForErrors(response)).rejects.toEqual(rejection);
    expect(response.json).toHaveBeenCalled();
  });

  it('rejects if status is 401', async () => {
    const response = {
      status: 401,
      body: 'Authentication error:',
    };

    await expect(ApiClient.checkForErrors(response)).resolves.toEqual({});
  });
});

describe('API calls', () => {
  const mockGet = jest.fn(() => ({}));

  beforeAll(() => {
    Object.assign(ApiClient, {
      request: mockGet,
    });
  });

  describe('create', () => {
    it('calls request with /create and post', () => {
      expect(ApiClient.create('/create', {})).toEqual({});
      expect(ApiClient.request).toHaveBeenCalledWith('/create', {}, 'post');
    });
  });

  describe('get', () => {
    it('calls request with path and get', () => {
      expect(ApiClient.get('/get')).toEqual({});
      expect(ApiClient.request).toHaveBeenCalledWith('/get', null, 'get', {});
    });

    it('passes on options', () => {
      expect(ApiClient.get('/get', { ignore404: true })).toEqual({});
      expect(ApiClient.request).toHaveBeenCalledWith('/get', null, 'get', {
        ignore404: true,
      });
    });
  });

  describe('update', () => {
    it('calls request with path and put', () => {
      expect(ApiClient.update('/update', {})).toEqual({});
      expect(ApiClient.request).toHaveBeenCalledWith('/update', {}, 'put');
    });
  });

  describe('destroy', () => {
    it('calls request with path and delete', () => {
      expect(ApiClient.destroy('/destroy')).toEqual({});
      expect(ApiClient.request).toHaveBeenCalledWith(
        '/destroy',
        null,
        'delete'
      );
    });
  });

  afterAll(() => {
    ApiClient.request.mockClear();
  });
});
