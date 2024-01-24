import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ProfileThresholdField } from './ProfileThresholdField';

jest.mock('redux-form', () => ({
  Field: ({ defaultValue, props }) => <div {...props}>{defaultValue}</div>, // eslint-disable-line
  reduxForm: () => () => ({}),
}));

describe('ProfileThresholdField', () => {
  it('expect to render a threshold without error', () => {
    const threshold = 10;
    render(<ProfileThresholdField previousThreshold={threshold} />);

    expect(screen.getByText(threshold)).toBeInTheDocument();
  });

  it('expect to render a validation error', () => {
    render(<ProfileThresholdField previousThreshold={120} />);

    expect(
      screen.getByText('Threshold has to be a number between 0 and 100')
    ).toBeInTheDocument();
  });
});
