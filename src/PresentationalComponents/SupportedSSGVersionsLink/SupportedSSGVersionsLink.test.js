import { render } from '@testing-library/react';
import SupportedSSGVersionsLink from './SupportedSSGVersionsLink';

describe('SupportedSSGVersionsLink', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(<SupportedSSGVersionsLink count={0} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
