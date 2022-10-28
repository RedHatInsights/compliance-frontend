import { render } from '@testing-library/react';
import ComplianceRemediationButton from './ComplianceRemediationButton';
import { buildNonCompliantSystems } from '@/__factories__/systems';

jest.mock(
  '@redhat-cloud-services/frontend-components-remediations/RemediationButton',
  () =>
    // eslint-disable-next-line react/display-name,react/prop-types
    ({ onRemediationCreated, dataProvider }) => {
      onRemediationCreated?.({
        getNotification: () => ({}),
      });

      dataProvider?.();

      return <div>Button</div>;
    }
);

jest.mock('Utilities/Dispatcher', () => ({
  ...jest.requireActual('Utilities/Dispatcher'),
  dispatchNotification: () => ({}),
}));

describe('ComplianceRemediationButton', () => {
  const nonComplianceSystems = buildNonCompliantSystems();

  it('expect to render without error', () => {
    const component = (
      <ComplianceRemediationButton allSystems={nonComplianceSystems} />
    );
    const { container } = render(component);

    expect(container).toMatchSnapshot();
  });

  it('expect to render without error and selected rules', () => {
    const component = (
      <ComplianceRemediationButton
        allSystems={nonComplianceSystems}
        selectedRules={[{ refId: 'xccdf_org.ssgproject.profile_5_rule_13' }]}
      />
    );
    const { container } = render(component);

    expect(container).toMatchSnapshot();
  });
});
