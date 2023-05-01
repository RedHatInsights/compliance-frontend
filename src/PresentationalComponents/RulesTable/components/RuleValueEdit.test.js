import { render, fireEvent } from '@testing-library/react';
import { getByText } from '@testing-library/dom';
import { valueDefinitions } from '../../../__fixtures__/values.js';
import usePolicyMutation from '../../../Mutations/hooks/usePolicyMutation';
import RuleValueEdit from './RuleValueEdit';

jest.mock('react-router-dom', () => ({
  Prompt: () => {
    return <></>;
  },
}));

jest.mock('../../../Mutations/hooks/usePolicyMutation');
usePolicyMutation.mockImplementation(() => () => {
  return;
});

describe('RuleValueEdit', () => {
  it('expect to render values', () => {
    const component = (
      <RuleValueEdit
        rule={{
          valueDefinitions,
          profile: {
            id: 'policy-ID-1',
            values: {
              1: 'first default defined value',
            },
          },
          ruleValues: {},
        }}
      />
    );
    const { container } = render(component);

    expect(getByText(container, 'default string value')).not.toBe(null);
    expect(getByText(container, 'second default string value')).not.toBe(null);
  });

  it('expect to render user values', () => {
    const component = (
      <RuleValueEdit
        rule={{
          valueDefinitions,
          profile: {
            id: 'policy-ID-1',
            values: {
              2: 'second default defined value',
            },
          },
          ruleValues: {
            2: 'second user defined value',
          },
        }}
      />
    );
    const { container } = render(component);

    expect(getByText(container, 'second user defined value')).not.toBe(null);
  });

  it('expect to allow editing', () => {
    const component = (
      <RuleValueEdit
        rule={{
          valueDefinitions: [valueDefinitions[0]],
          profile: {
            id: 'policy-ID-1',
            values: {
              1: 'second default defined value',
            },
          },
          ruleValues: {
            1: 'second user defined value',
          },
        }}
      />
    );
    const { container } = render(component);

    expect(container.querySelector('[aria-label="Save edits"]')).toBe(null);
    const editButton = container.querySelector('button');
    fireEvent.click(editButton);

    expect(container.querySelector('[aria-label="Save edits"]')).not.toBe(null);
  });
});
