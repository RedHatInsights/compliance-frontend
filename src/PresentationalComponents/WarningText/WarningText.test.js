import { render } from '@testing-library/react';
import WarningText from './WarningText';

describe('WarningText', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(<WarningText>Test Warning Text</WarningText>);

    expect(asFragment()).toMatchSnapshot();
  });
});
