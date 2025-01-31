import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper';
import FinishedCreatePolicyRest from './FinishedCreatePolicyRest';
import FinishedCreatePolicy from './FinishedCreatePolicy';
import { render } from '@testing-library/react';

jest.mock('./FinishedCreatePolicyRest');

describe('FinishedCreatePolicy', () => {
  it('renders the FinishedCreatePolicy component', () => {
    render(
      <TestWrapper>
        <FinishedCreatePolicy />
      </TestWrapper>
    );

    expect(FinishedCreatePolicyRest).toBeCalled();
  });
});
