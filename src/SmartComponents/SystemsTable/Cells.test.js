import { render } from '@testing-library/react';
import {
  Name,
  SSGVersion,
  Policies,
  FailedRules,
  ComplianceScore,
  LastScanned,
} from './Cells';
import { systems } from '@/__fixtures__/systems.js';
const testSystem = systems[0].node;

describe('Name', () => {
  it('returns', () => {
    const { asFragment } = render(<Name {...testSystem} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('SSGVersion', () => {
  it('returns', () => {
    const { asFragment } = render(<SSGVersion {...testSystem} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('returns no error without testResultProfiles', () => {
    const { asFragment } = render(
      <SSGVersion {...testSystem} testResultProfiles={[]} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Policies', () => {
  it('returns', () => {
    const { asFragment } = render(<Policies {...testSystem} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('returns without error without policies', () => {
    const { asFragment } = render(
      <Policies {...testSystem} policies={undefined} />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('FailedRules', () => {
  it('returns', () => {
    const { asFragment } = render(<FailedRules {...testSystem} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('returns no error without testResultProfiles', () => {
    const { asFragment } = render(
      <FailedRules {...testSystem} testResultProfiles={[]} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('ComplianceScore', () => {
  it('returns', () => {
    const { asFragment } = render(<ComplianceScore {...testSystem} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('returns no error without testResultProfiles', () => {
    const { asFragment } = render(
      <ComplianceScore {...testSystem} testResultProfiles={[]} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('LastScanned', () => {
  it('returns', () => {
    const { asFragment } = render(<LastScanned {...testSystem} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('returns NEVER', () => {
    const { asFragment } = render(
      <LastScanned {...testSystem} testResultProfiles={undefined} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('returns no error without testResultProfiles', () => {
    const { asFragment } = render(
      <LastScanned {...testSystem} testResultProfiles={[]} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
