import propTypes from 'prop-types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { reduxForm } from 'redux-form';
import TestWrapper from '@/Utilities/TestWrapper';

import { ProfileThresholdField } from './ProfileThresholdField';

const Form = reduxForm({
  form: 'policyForm',
})(({ children }) => children);

const FormTestWrapper = ({ children }) => (
  <TestWrapper>
    <Form>{children}</Form>
  </TestWrapper>
);
FormTestWrapper.propTypes = {
  children: propTypes.node,
};

describe('ProfileThresholdField', () => {
  it('expect to render a threshold without error', () => {
    const threshold = 10;
    render(
      <FormTestWrapper>
        <ProfileThresholdField previousThreshold={threshold} />
      </FormTestWrapper>
    );

    expect(screen.getByLabelText('compliance threshold')).toBeInTheDocument();
  });

  it('expect to render a validation error', () => {
    render(
      <FormTestWrapper>
        <ProfileThresholdField previousThreshold={120} />
      </FormTestWrapper>
    );

    expect(screen.getByLabelText('compliance threshold')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });
});
