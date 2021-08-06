import {
  Name,
  SSGVersion,
  DetailsLink,
  Policies,
  FailedRules,
  ComplianceScore,
  LastScanned,
} from './Cells';
import { systems } from '@/__fixtures__/systems.js';
const testSystem = systems[0].node;

describe('Name', () => {
  it('returns', () => {
    expect(renderJson(<Name {...testSystem} />)).toMatchSnapshot();
  });
});

describe('SSGVersion', () => {
  it('returns', () => {
    expect(renderJson(<SSGVersion {...testSystem} />)).toMatchSnapshot();
  });

  it('returns no error without testResultProfiles', () => {
    expect(
      renderJson(<SSGVersion {...testSystem} testResultProfiles={[]} />)
    ).toMatchSnapshot();
  });
});

describe('DetailsLink', () => {
  it('returns', () => {
    expect(renderJson(<DetailsLink {...testSystem} />)).toMatchSnapshot();
  });
});

describe('Policies', () => {
  it('returns', () => {
    expect(renderJson(<Policies {...testSystem} />)).toMatchSnapshot();
  });

  it('returns without error without policies', () => {
    expect(
      renderJson(<Policies {...testSystem} policies={undefined} />)
    ).toMatchSnapshot();
  });
});

describe('FailedRules', () => {
  it('returns', () => {
    expect(renderJson(<FailedRules {...testSystem} />)).toMatchSnapshot();
  });
});

describe('ComplianceScore', () => {
  it('returns', () => {
    expect(renderJson(<ComplianceScore {...testSystem} />)).toMatchSnapshot();
  });
});

describe('LastScanned', () => {
  it('returns', () => {
    expect(renderJson(<LastScanned {...testSystem} />)).toMatchSnapshot();
  });

  it('returns NEVER', () => {
    expect(
      renderJson(<LastScanned {...testSystem} testResultProfiles={undefined} />)
    ).toMatchSnapshot();
  });
});
