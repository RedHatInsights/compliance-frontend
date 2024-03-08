import React from 'react';
import propTypes from 'prop-types';
import { Tab, TabTitleText, TabContent } from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { RoutedTabs } from 'PresentationalComponents';

const FormTabLayout = ({ fields }) => {
  const { renderForm } = useFormApi();

  return (
    <RoutedTabs ouiaId="EditSystems" defaultTab="rules" id="policy-tabs">
      {fields.map((field) => (
        <Tab
          key={field.name}
          eventKey={field.name}
          ouiaId={field.name}
          title={<TabTitleText>{field.label}</TabTitleText>}
        >
          <TabContent>{renderForm([field])}</TabContent>
        </Tab>
      ))}
    </RoutedTabs>
  );
};

FormTabLayout.propTypes = {
  fields: propTypes.array,
};

export default FormTabLayout;
