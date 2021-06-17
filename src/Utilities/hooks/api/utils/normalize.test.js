import supportedSsgs from '../__fixtures__/supported_ssgs.json';
import { normalizeData } from './normalize';

describe('normalizeData', () => {
  it('normalizes API data', () => {
    expect(
      normalizeData(supportedSsgs, 'supportedSsg', '/supported_ssgs')
    ).toMatchSnapshot();
  });

  //     it('sorts it when sortBy is given', () => {
  //         expect(normalizeData(supportedSsgs, 'supportedSsg', '/supported_ssgs', 'osMajorVersion desc')).toMatchSnapshot();
  //     });
  //
  //     it('sorts it asc when sortBy is given', () => {
  //         expect(normalizeData(supportedSsgs, 'supportedSsg', '/supported_ssgs', 'osMajorVersion asc')).toMatchSnapshot();
  //     });
  //
  //     it('skips sorting when column is not known', () => {
  //         expect(normalizeData(supportedSsgs, 'supportedSsg', '/supported_ssgs', 'unknownColumn asc')).toMatchSnapshot();
  //     });
});
