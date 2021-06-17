import EditPolicyForm from './EditPolicyForm';
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(() => ({})),
  useDispatch: jest.fn(() => ({})),
}));

describe('EditPolicyForm', () => {
  it('expect to render without error', () => {
    const policy = {
      id: '1',
      refId: '121212',
      name: 'profile1',
      description: 'profile description',
      totalHostCount: 1,
      complianceThreshold: 1,
      compliantHostCount: 1,
      policy: {
        name: 'parentpolicy',
      },
      businessObjective: {
        id: '1',
        title: 'BO 1',
      },
      benchmark: {
        title: 'benchmark',
        version: '0.1.5',
      },
    };
    const wrapper = shallow(<EditPolicyForm {...policy} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
