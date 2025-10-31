import { render } from '@testing-library/react';
import { rules } from '@/__fixtures__/rules';
import RuleDetailsRow from './RuleDetailsRow';

describe('RuleDetailsRow', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(<RuleDetailsRow item={rules[0]} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
