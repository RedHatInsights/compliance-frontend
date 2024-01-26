import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

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
    render(
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

    expect(screen.getByText('default string value')).toBeInTheDocument();
    expect(screen.getByText('second default string value')).toBeInTheDocument();
  });

  it('expect to render user values', () => {
    render(
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

    expect(screen.getByText('second user defined value')).toBeInTheDocument();
  });

  it('expect to allow editing', () => {
    render(
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

    expect(screen.queryByLabelText('Save edits')).not.toBeInTheDocument();
    const editButton = screen.getByLabelText('Edit value button');
    fireEvent.click(editButton);

    expect(screen.getByLabelText('Save edits')).toBeInTheDocument();
  });
});
