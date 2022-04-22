import React from 'react';
import { QUERY, PolicyDetails } from './PolicyDetails';

const mocks = [
  {
    request: {
      query: QUERY,
      variables: {
        policyId: '1234',
      },
    },
    result: {
      data: {
        profile: {
          id: '1',
          refId: '121212',
          name: 'profile1',
          description: 'profile description',
          totalHostCount: 1,
          complianceThreshold: 1,
          compliantHostCount: 1,
          osMajorVersion: '7',
          hosts: [],
          policy: {
            name: 'parentpolicy',
            profiles: [
              {
                id: '1',
                refId: '121212',
                name: 'profile1',
                description: 'profile description',
                osMinorVersion: '9',
                businessObjective: {
                  id: '1',
                  title: 'BO 1',
                },
                benchmark: {
                  title: 'benchmark',
                  version: '0.1.5',
                },
              },
            ],
          },
          businessObjective: {
            id: '1',
            title: 'BO 1',
          },
          benchmark: {
            title: 'benchmark',
            version: '0.1.5',
          },
        },
      },
    },
  },
];

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => ({})),
}));

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useQuery: () => ({
    data: mocks[0].result.data,
    error: undefined,
    loading: undefined,
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
    useParams: jest.fn().mockReturnValue({ policy_id: '1' }), // eslint-disable-line
  useLocation: jest.fn(() => ({
    hash: '',
  })),
}));

jest.mock('Utilities/hooks/useDocumentTitle', () => ({
  useTitleEntity: () => ({}),
  setTitle: () => ({}),
}));

describe('PolicyDetails', () => {
  it('expect to render without error', () => {
    const wrapper = shallow(<PolicyDetails />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
