import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ReduxFormTextInput, ReduxFormTextArea } from './ReduxFormWrappers';

describe('ReduxFormTextInput', () => {
  it('expect to render without error', () => {
    const field = {
      input: {
        onChange: jest.fn(),
        value: 'Value',
      },
      'aria-label': 'text-input',
      additionalProp: 'Prop1',
    };
    render(<ReduxFormTextInput {...field} />);

    expect(screen.getByLabelText('text-input').value).toEqual(
      field.input.value
    );
  });

  it('expect to render with defaultValue', () => {
    const field = {
      input: {
        onChange: jest.fn(),
      },
      'aria-label': 'text-input',
      defaultValue: 'Default Value',
      additionalProp: 'Prop1',
    };
    render(<ReduxFormTextInput {...field} />);

    expect(screen.getByLabelText('text-input').value).toEqual(
      field.defaultValue
    );
  });
});

describe('ReduxFormTextArea', () => {
  it('expect to render without error', () => {
    const field = {
      input: {
        onChange: jest.fn(),
        value: 'Text',
      },
      'aria-label': 'text-area',
      selected: 'SELECTED_VALUE',
      additionalProp: 'Prop1',
    };
    render(<ReduxFormTextArea {...field} />);

    expect(screen.getByText(field.input.value)).toBeInTheDocument();
  });
});
