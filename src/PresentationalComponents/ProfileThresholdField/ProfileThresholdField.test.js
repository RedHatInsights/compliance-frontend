import { render } from '@testing-library/react';
import { queryByText } from '@testing-library/dom';
import { ProfileThresholdField } from './ProfileThresholdField';

jest.mock('redux-form', () => ({
  Field: ({ defaultValue, props }) => <div {...props}>{defaultValue}</div>, // eslint-disable-line
  reduxForm: () => () => ({}),
}));

describe('ProfileThresholdField', () => {
  it('expect to render a threshold without error', () => {
    const threshold = 10;
    const { container } = render(
      <ProfileThresholdField previousThreshold={threshold} />
    );

    expect(queryByText(container, threshold)).not.toBeNull();
  });

  it('expect to render a validation error', () => {
    const { container } = render(
      <ProfileThresholdField previousThreshold={120} />
    );

    expect(
      queryByText(container, 'Threshold has to be a number between 0 and 100')
    ).not.toBeNull();
  });
});
