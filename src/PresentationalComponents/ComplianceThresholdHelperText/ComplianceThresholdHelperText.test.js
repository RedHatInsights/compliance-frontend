import { render } from '@testing-library/react';
import { queryByText } from '@testing-library/dom';

import ComplianceThresholdHelperText from './ComplianceThresholdHelperText';

describe('ComplianceThresholdHelperText', () => {
  it('expect to render nothing when threshold is valid', () => {
    const { container } = render(
      <ComplianceThresholdHelperText threshold="100" />
    );

    expect(queryByText(container, 'Threshold')).toBeNull();
  });

  it('expect to render a note when the threshold is not valid', () => {
    const { container } = render(
      <ComplianceThresholdHelperText threshold="1222" />
    );

    expect(queryByText(container, 'between 0 and 100')).toBeNull();
  });

  it('expect to render a note when the threshold has too many decimal places', () => {
    const { container } = render(
      <ComplianceThresholdHelperText threshold="10.222222" />
    );

    expect(queryByText(container, 'maximum of one decimal place')).toBeNull();
  });
});
