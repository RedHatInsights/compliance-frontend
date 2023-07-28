import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import EditPolicyDetailsTab, {
  useThresholdValidate,
} from './EditPolicyDetailsTab';

describe('EditPolicyDetailsTab', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(
      <EditPolicyDetailsTab
        policy={{
          id: 'POLICY_ID',
          name: 'Policy Name',
          businessObjective: {
            title: 'BO title',
            id: 1,
          },
          complianceThreshold: '30',
        }}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('useThresholdValidate', () => {
  it('expect to render without error', () => {
    const { result } = renderHook(() => useThresholdValidate());
    expect(result.current[1](100)).toBe(true);
  });
});
