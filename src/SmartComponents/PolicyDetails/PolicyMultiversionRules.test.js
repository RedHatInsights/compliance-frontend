import { render } from '@testing-library/react';
import PolicyMultiversionRules from './PolicyMultiversionRules';
import { policies } from '@/__fixtures__/policies';

describe('PolicyMultiversionRules', () => {
  it('expect to render without error', () => {
    const hosts = [
      { osMinorVersion: '9' },
      { osMinorVersion: '9' },
      { osMinorVersion: '8' },
      { osMinorVersion: '999' },
    ];
    const policy = {
      ...policies.edges[0].node,
      hosts,
    };
    const { asFragment } = render(<PolicyMultiversionRules policy={policy} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
