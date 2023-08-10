import { useMutation } from '@apollo/client';
import { dispatchAction } from 'Utilities/Dispatcher';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ policy_id: '1' })), // eslint-disable-line
}));
jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate',
  () => () => ({})
);

jest.mock('@apollo/client');
jest.mock('Utilities/Dispatcher');

import DeleteReport from './DeleteReport.js';

describe('DeleteReport', () => {
  beforeEach(() => {
    useMutation.mockImplementation((query, options) => {
      return [
        function () {
          options.onCompleted();
        },
      ];
    });
    dispatchAction.mockImplementation(() => {});
  });

  it('expect to render an open modal without error', () => {
    const component = mount(<DeleteReport />);

    expect(toJson(component)).toMatchSnapshot();
  });
});
