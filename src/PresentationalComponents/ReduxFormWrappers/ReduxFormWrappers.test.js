import { render } from '@testing-library/react';
import { ReduxFormTextInput, ReduxFormTextArea } from './ReduxFormWrappers';

describe('ReduxFormTextInput', () => {
  it('expect to render without error', () => {
    const field = {
      input: {
        onChange: jest.fn(),
        value: 'Value',
      },
      additionalProp: 'Prop1',
    };
    const { asFragment } = render(<ReduxFormTextInput {...field} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render with defaultValue', () => {
    const field = {
      input: {
        onChange: jest.fn(),
      },
      defaultValue: 'Default Value',
      additionalProp: 'Prop1',
    };
    const { asFragment } = render(<ReduxFormTextInput {...field} />);

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('ReduxFormTextArea', () => {
  it('expect to render without error', () => {
    const field = {
      input: {
        onChange: jest.fn(),
      },
      selected: 'SELECTED_VALUE',
      additionalProp: 'Prop1',
    };
    const { asFragment } = render(<ReduxFormTextArea {...field} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
