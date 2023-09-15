import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';

import RulesField from './RulesField';

const formSchema = {
  fields: [{ name: 'rules-field', component: 'rules-field', label: 'Rules' }],
};

const TestWrapper = (props) => (
  <FormRenderer
    onSubmit={() => {}}
    FormTemplate={FormTemplate}
    componentMapper={{
      'rules-field': RulesField,
    }}
    schema={formSchema}
    {...props}
  />
);

describe.skip('RulesField', () => {
  it('expected to render', () => {
    render(<TestWrapper />);
    screen.debug();
  });
});
