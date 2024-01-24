import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import ComplianceThresholdHelperText from './ComplianceThresholdHelperText';

describe('ComplianceThresholdHelperText', () => {
  it('expect to render nothing when threshold is valid', () => {
    render(<ComplianceThresholdHelperText threshold="100" />);

    expect(screen.queryByText('Threshold')).not.toBeInTheDocument();
  });

  it('expect to render a note when the threshold is not valid', () => {
    render(<ComplianceThresholdHelperText threshold="1222" />);

    expect(screen.queryByText('between 0 and 100')).not.toBeInTheDocument();
  });

  it('expect to render a note when the threshold has too many decimal places', () => {
    render(<ComplianceThresholdHelperText threshold="10.222222" />);

    expect(
      screen.queryByText('maximum of one decimal place')
    ).not.toBeInTheDocument();
  });
});
