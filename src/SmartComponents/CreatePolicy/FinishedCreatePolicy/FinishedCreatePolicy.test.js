import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper';
import FinishedCreatePolicyRest from './FinishedCreatePolicyRest';
import FinishedCreatePolicyGraphQL from './FinishedCreatePolicyGraphQL';
import FinishedCreatePolicy from './FinishedCreatePolicy';
import useAPIV2FeatureFlag from '../../../Utilities/hooks/useAPIV2FeatureFlag';
import { render, screen } from '@testing-library/react';

jest.mock('./FinishedCreatePolicyRest');
jest.mock('./FinishedCreatePolicyGraphQL');
jest.mock('../../../Utilities/hooks/useAPIV2FeatureFlag');

describe('FinishedCreatePolicy', () => {
  it('renders the loading state when the flag is not yet fetched', () => {
    useAPIV2FeatureFlag.mockReturnValue(undefined);
    render(
      <TestWrapper>
        <FinishedCreatePolicy />
      </TestWrapper>
    );

    screen.getByRole('progressbar');
  });

  it('renders the GraphQL component if the flag is off', () => {
    useAPIV2FeatureFlag.mockReturnValue(false);
    render(
      <TestWrapper>
        <FinishedCreatePolicy />
      </TestWrapper>
    );

    expect(FinishedCreatePolicyGraphQL).toBeCalled();
  });

  it('renders the REST API component if the flag is on', () => {
    useAPIV2FeatureFlag.mockReturnValue(true);
    render(
      <TestWrapper>
        <FinishedCreatePolicy />
      </TestWrapper>
    );

    expect(FinishedCreatePolicyRest).toBeCalled();
  });
});
