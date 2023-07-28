import { render } from '@testing-library/react';
import ComplianceThresholdHelperText from './ComplianceThresholdHelperText';

describe('ComplianceThresholdHelperText', () => {
  const defaultProps = {
    threshold: 100,
  };

  it('expect to render without error', () => {
    const { asFragment } = render(
      <ComplianceThresholdHelperText {...defaultProps} />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
