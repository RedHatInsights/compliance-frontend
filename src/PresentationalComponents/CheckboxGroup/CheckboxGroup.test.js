import { render } from '@testing-library/react';
import { CheckboxFieldArray } from './CheckboxGroup';

describe('CheckboxFieldArray', () => {
  let input;
  let options;

  beforeEach(() => {
    input = { name: 'policies', value: '' };
    options = [
      {
        label: 'pci',
        value: '12345',
        defaultChecked: false,
      },
      {
        label: 'hipaa',
        value: '1111',
        defaultChecked: true,
      },
    ];
  });

  it('expect to render with default checked fields', () => {
    const { asFragment } = render(
      <CheckboxFieldArray input={input} options={options} />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render without default checked fields', () => {
    options[0].defaultChecked = undefined;
    options[1].defaultChecked = undefined;

    const { asFragment } = render(
      <CheckboxFieldArray input={input} options={options} />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
