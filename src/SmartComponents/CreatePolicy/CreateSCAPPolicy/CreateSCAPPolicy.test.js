import React from 'react';
import { render } from '@testing-library/react';
import CreateSCAPPolicy from './CreateSCAPPolicy';
import CreateSCAPPolicyRest from './CreateSCAPPolicyRest';
import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper';

jest.mock('./CreateSCAPPolicyRest');

describe('CreateSCAPPolicy', () => {
  it('renders the CreateSCAPPolicy component', () => {
    render(
      <TestWrapper>
        <CreateSCAPPolicy />
      </TestWrapper>
    );

    expect(CreateSCAPPolicyRest).toBeCalled();
  });
});
