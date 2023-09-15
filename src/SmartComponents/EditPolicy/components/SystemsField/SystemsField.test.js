import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import configureStore from 'redux-mock-store';
import { Provider as ReduxProvider } from 'react-redux';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import buildPolicy from '@/__factories__/policies';

import SystemsField from './SystemsField';
const mocks = () => [];

const formSchema = (props) => ({
  fields: [
    {
      name: 'systems-field',
      component: 'systems-field',
      label: 'Systems',
      ...props,
    },
  ],
});

const TestWrapper = (additionalProps) => (
  <MemoryRouter>
    <ReduxProvider store={configureStore()()}>
      <MockedProvider mocks={mocks(additionalProps.policy)}>
        <FormRenderer
          onSubmit={() => {}}
          FormTemplate={(props) => <FormTemplate {...props} />}
          componentMapper={{
            'systems-field': SystemsField,
          }}
          schema={formSchema}
          {...additionalProps}
        />
      </MockedProvider>
    </ReduxProvider>
  </MemoryRouter>
);

describe.skip('SystemsField', () => {
  it('expected to render', () => {
    const policy = buildPolicy();

    render(<TestWrapper policy={policy} schema={formSchema({ policy })} />);
    screen.debug();
  });
});
