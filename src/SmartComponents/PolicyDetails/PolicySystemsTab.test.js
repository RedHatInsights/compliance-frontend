import PolicySystemsTab from './PolicySystemsTab';
import { policies } from '@/__fixtures__/policies';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  useLocation: jest.fn().mockReturnValue({
    pathname: '/another-route',
    search: '',
    hash: '',
    state: null,
    key: '5nvxpbdafa',
  }),
}));

describe('PolicySystemsTab', () => {
  it('expect to render without error', () => {
    const policy = policies.edges[0].node;
    const wrapper = shallow(<PolicySystemsTab {...{ policy }} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('expect to render with no systems table', () => {
    const policy = {
      ...policies.edges[0].node,
      totalHostCount: 0,
      hosts: [],
    };

    const wrapper = shallow(<PolicySystemsTab {...{ policy }} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('expect to render with differentHostCount info', () => {
    const policy = {
      ...policies.edges[0].node,
      totalHostCount: policies.edges[0].node.totalHostCount + 1,
    };

    const wrapper = shallow(<PolicySystemsTab {...{ policy }} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
