import TestWrapper from '@redhat-cloud-services/frontend-components-utilities/TestingUtils/JestUtils/TestWrapper';
import { render, renderHook } from '@testing-library/react';
import FinishedCreatePolicyRest, {
  useUpdatePolicy,
} from './FinishedCreatePolicyRest';
import useCreatePolicy from '../../../Utilities/hooks/api/useCreatePolicy';
import useAssignRules from '../../../Utilities/hooks/api/useAssignRules';
import useAssignSystems from '../../../Utilities/hooks/api/useAssignSystems';
import useTailorings from '../../../Utilities/hooks/api/useTailorings';
import FinishedCreatePolicyBase from './FinishedCreatePolicyBase';

jest.mock('./FinishedCreatePolicyBase', () => jest.fn());
jest.mock('../../../Utilities/hooks/api/useCreatePolicy');
jest.mock('../../../Utilities/hooks/api/useAssignRules');
jest.mock('../../../Utilities/hooks/api/useAssignSystems');
jest.mock('../../../Utilities/hooks/api/useTailorings');

describe('FinishedCreatePolicyRest', () => {
  it('renders the base component with update policy callback', () => {
    render(
      <TestWrapper>
        <FinishedCreatePolicyRest />
      </TestWrapper>
    );

    expect(FinishedCreatePolicyBase).toBeCalledWith(
      { updatePolicy: expect.anything() },
      expect.anything()
    );
  });
});

describe('useUpdatePolicy', () => {
  const createdPolicyId = '93529cba-c28e-4a29-8ac3-058689a0b7d1';
  const createdTailoringId = '86412da4-ab6b-4783-82e3-74ee6a3cc270';

  let createPolicy = jest.fn(() => ({
    data: { id: createdPolicyId },
  }));
  let assignRules = jest.fn();
  let assignSystems = jest.fn();
  let fetchTailorings = jest.fn(() => ({
    data: [{ id: createdTailoringId, os_minor_version: 7 }],
  }));

  useCreatePolicy.mockImplementation(() => ({ fetch: createPolicy }));
  useAssignRules.mockImplementation(() => ({ fetch: assignRules }));
  useAssignSystems.mockImplementation(() => ({ fetch: assignSystems }));
  useTailorings.mockImplementation(() => ({ fetch: fetchTailorings }));

  const onProgress = jest.fn();

  afterEach(() => {
    useCreatePolicy.mockClear();
    useAssignRules.mockClear();
    useAssignSystems.mockClear();
    useTailorings.mockClear();
    onProgress.mockClear();
  });

  const policyDataToSubmit = {
    name: 'Some policy name',
    description: 'Some policy description',
    businessObjective: { title: 'Some defined business objective' },
    complianceThreshold: 100,
    benchmarkId: '4610092b-2e7f-4155-b101-964fede3566b',
    selectedRuleRefIds: [
      {
        ruleRefIds: ['474129f9-1168-429e-833a-8d69e38284b8'],
        osMinorVersion: 7,
      },
    ],
    hosts: [{ id: '166ba579-20a6-436b-a712-5b1f5085a9eb' }],
  };

  it('calls create policy with the submitted data', async () => {
    const { result } = renderHook(() => useUpdatePolicy());

    await result.current(undefined, policyDataToSubmit, onProgress);

    expect(createPolicy).toBeCalledWith(
      [
        undefined, // X-RH identity
        {
          business_objective: policyDataToSubmit.businessObjective.title,
          compliance_threshold: policyDataToSubmit.complianceThreshold,
          description: policyDataToSubmit.description,
          profile_id: policyDataToSubmit.benchmarkId,
          title: policyDataToSubmit.name,
        },
      ],
      false // to return response data
    );
  });

  it('assigns systems', async () => {
    const { result } = renderHook(() => useUpdatePolicy());

    await result.current(undefined, policyDataToSubmit, onProgress);

    expect(assignSystems).toBeCalledWith(
      [
        createdPolicyId,
        undefined, // X-RH identity
        {
          ids: policyDataToSubmit.hosts.map(({ id }) => id),
        },
      ],
      false // to return response data
    );
  });

  it('fetches tailorings and adds rules to these tailorings', async () => {
    const { result } = renderHook(() => useUpdatePolicy());

    await result.current(undefined, policyDataToSubmit, onProgress);

    expect(fetchTailorings).toBeCalledWith(
      [
        createdPolicyId,
        undefined, // X-RH identity
        100,
      ],
      false // to return response data
    );

    expect(assignRules).toBeCalledWith(
      [
        createdPolicyId,
        createdTailoringId,
        undefined,
        { ids: policyDataToSubmit.selectedRuleRefIds[0].ruleRefIds },
      ],
      false
    );
  });

  it('updates progress', async () => {
    const { result } = renderHook(() => useUpdatePolicy());

    await result.current(undefined, policyDataToSubmit, onProgress);

    expect(onProgress).toBeCalledTimes(4);
  });
});
