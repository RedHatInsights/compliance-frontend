import React from 'react';
import useAPIV2FeatureFlag from '../../../Utilities/hooks/useAPIV2FeatureFlag';
import { render, screen } from '@testing-library/react';
import CreateSCAPPolicy from './CreateSCAPPolicy';
import CreateSCAPPolicyGraphQL from './CreateSCAPPolicyGraphQL';
import CreateSCAPPolicyRest from './CreateSCAPPolicyRest';
import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper';

jest.mock('./CreateSCAPPolicyRest');
jest.mock('./CreateSCAPPolicyGraphQL');
jest.mock('../../../Utilities/hooks/useAPIV2FeatureFlag');

describe('CreateSCAPPolicy', () => {
  it('renders the loading state when the flag is not yet fetched', () => {
    useAPIV2FeatureFlag.mockReturnValue(undefined);
    render(
      <TestWrapper>
        <CreateSCAPPolicy />
      </TestWrapper>
    );

    screen.getByRole('progressbar');
  });

  it('renders the GraphQL component if the flag is off', () => {
    useAPIV2FeatureFlag.mockReturnValue(false);
    render(
      <TestWrapper>
        <CreateSCAPPolicy />
      </TestWrapper>
    );

    expect(CreateSCAPPolicyGraphQL).toBeCalled();
  });

  it('renders the REST API component if the flag is on', () => {
    useAPIV2FeatureFlag.mockReturnValue(true);
    render(
      <TestWrapper>
        <CreateSCAPPolicy />
      </TestWrapper>
    );

    expect(CreateSCAPPolicyRest).toBeCalled();
  });
});
