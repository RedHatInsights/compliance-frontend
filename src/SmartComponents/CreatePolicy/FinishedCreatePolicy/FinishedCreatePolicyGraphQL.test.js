import { render } from '@testing-library/react';
import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper';
import FinishedCreatePolicyGraphQL from './FinishedCreatePolicyGraphQL';
import FinishedCreatePolicyBase from './FinishedCreatePolicyBase';
import { usePolicy } from '../../../Mutations';

jest.mock('./FinishedCreatePolicyBase', () => jest.fn());
jest.mock('../../../Mutations');

describe('FinishedCreatePolicyGraphQL', () => {
  it('passes params to the base component', () => {
    const params = { test: 'xyz' };
    render(
      <TestWrapper>
        <FinishedCreatePolicyGraphQL {...params} />
      </TestWrapper>
    );

    expect(FinishedCreatePolicyBase).toBeCalledWith(
      {
        ...params,
      },
      expect.anything()
    );
  });

  it('uses update policy mutation', () => {
    render(
      <TestWrapper>
        <FinishedCreatePolicyGraphQL />
      </TestWrapper>
    );

    expect(usePolicy).toBeCalled();
  });
});
