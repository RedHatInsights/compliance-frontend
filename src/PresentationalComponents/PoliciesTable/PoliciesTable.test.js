import { policies as rawPolicies } from '@/__fixtures__/policies.js';
import { PoliciesTable } from './PoliciesTable.js';

const policies = rawPolicies.edges.map((profile) => profile.node);
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: () => 'Mocked Link',
  useLocation: jest.fn(),
}));

jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate',
  () => () => ({})
);

describe('PoliciesTable', () => {
  const defaultProps = {
    history: { push: jest.fn() },
    location: {},
  };
  let wrapper;

  it('expect to render without error', () => {
    wrapper = shallow(<PoliciesTable {...defaultProps} policies={policies} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('expect to render emptystate', () => {
    wrapper = shallow(<PoliciesTable {...defaultProps} policies={[]} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('expect to render SystemsCountWarning', () => {
    wrapper = shallow(
      <PoliciesTable
        {...defaultProps}
        policies={policies.map((p) => ({ ...p, totalHostCount: 0 }))}
      />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
