import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EditPolicyDetails } from './EditPolicyDetails.js';
import buildProfiles from '@/__factories__/profiles.js';

jest.mock('redux-form', () => ({
  Field: ({ defaultValue, ...props }) => <div {...props}>{defaultValue}</div>, // eslint-disable-line
  reduxForm: () => (comp) => comp,
  formValueSelector: () => () => ({}),
  propTypes: { change: () => null },
}));

// TODO Test in proper redux-form context
describe('EditPolicyDetails', () => {
  const profile = buildProfiles(1)[0];
  it('expect to render without error', () => {
    render(<EditPolicyDetails change={() => ({})} policy={profile} />);

    expect(screen.getByText('Policy name')).toBeInTheDocument();
  });
});
