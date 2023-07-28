import { render } from '@testing-library/react';
import { policies as rawPolicies } from '@/__fixtures__/policies.js';
import ReportDetailsDescription from './ReportDetailsDescription';

const profiles = rawPolicies.edges.map((profile) => profile.node);

describe('ReportDetailsDescription', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(
      <ReportDetailsDescription profile={profiles[0]} />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
