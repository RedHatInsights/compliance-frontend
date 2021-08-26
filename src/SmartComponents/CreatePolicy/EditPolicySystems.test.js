import { EditPolicySystems } from './EditPolicySystems.js';

describe('EditPolicySystems', () => {
  const defaultProps = {
    change: () => ({}),
  };

  it('expect to render without error', async () => {
    const component = shallow(
      <EditPolicySystems
        {...defaultProps}
        osMajorVersion="7"
        selectedSystemIds={[]}
        policy={{ supportedOsVersions: ['1.2', '1.1', '1.3', '1.4'] }}
      />
    );
    expect(toJson(component)).toMatchSnapshot();
  });
});
