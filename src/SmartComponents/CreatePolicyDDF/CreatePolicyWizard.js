import React from 'react';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';
import { FormTemplate } from '@data-driven-forms/pf4-component-mapper';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

import schema from './schema';
import componentMapper from './componentMapper';

const CreatePolicyWizard = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/scappolicies');
  };

  return (
    <FormRenderer
      schema={schema}
      componentMapper={componentMapper}
      FormTemplate={(props) => (
        <FormTemplate {...props} showFormControls={false} />
      )}
      onCancel={handleCancel}
    />
  );
};

export default CreatePolicyWizard;
