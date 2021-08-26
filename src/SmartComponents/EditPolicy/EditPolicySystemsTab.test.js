import EditPolicySystemsTab from './EditPolicySystemsTab.js';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
    location: {},
  }),
}));

describe('EditPolicySystemsTab', () => {
  const defaultProps = {
    policy: {
      id: '12345abcde',
      osMajorVersion: '7',
      supportedOsVersions: ['1.2', '1.1', '1.3', '1.4'],
    },
    newRuleTabs: false,
  };

  it('expect to render without error', async () => {
    const wrapper = shallow(<EditPolicySystemsTab {...defaultProps} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('expect to render with new tabs alert', async () => {
    const wrapper = shallow(
      <EditPolicySystemsTab {...defaultProps} newRuleTabs={true} />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
