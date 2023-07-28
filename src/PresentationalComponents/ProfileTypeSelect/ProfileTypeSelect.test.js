import { render } from '@testing-library/react';
import ProfileTypeSelect from './ProfileTypeSelect';

describe('ProfileTypeSelect', () => {
  const defaultProps = {
    profiles: [
      { description: 'foodesc', name: 'fooname', id: 'fooid' },
      { description: 'foodesc', name: 'fooname', id: 'fooid', disabled: true },
    ],
  };

  it('expect to render without error', () => {
    const { asFragment } = render(<ProfileTypeSelect {...defaultProps} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
