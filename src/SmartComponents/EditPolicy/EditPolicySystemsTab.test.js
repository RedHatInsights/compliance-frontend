import { render } from '@testing-library/react';
import EditPolicySystemsTab from './EditPolicySystemsTab.js';

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
    const { asFragment } = render(<EditPolicySystemsTab {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render with new tabs alert', async () => {
    const { asFragment } = render(
      <EditPolicySystemsTab {...defaultProps} newRuleTabs={true} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
