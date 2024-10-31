import supportedSsgs from './__fixtures__/supported_ssgs.json';
import useCollection from './useCollection';
import useApi from './useApi';
jest.mock('./useApi');

describe('useCollection', () => {
  it.skip('returns an instance', async () => {
    const client = {
      get: () => supportedSsgs,
    };
    useApi.mockImplementation(jest.fn(() => client));
    const collection = await useCollection('supported_ssgs', {
      collection: { type: 'supportedSsg' },
    });

    expect(collection).toMatchSnapshot();
  });
});
