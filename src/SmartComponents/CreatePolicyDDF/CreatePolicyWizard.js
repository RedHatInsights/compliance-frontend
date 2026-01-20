import React, { useState } from 'react';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';
import { FormTemplate } from '@data-driven-forms/pf4-component-mapper';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

import schema from './schema';
import componentMapper from './componentMapper';
import FinishedStep from './components/FinishedStep';

const CreatePolicyWizard = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formValues, setFormValues] = useState(null);

  const handleSubmit = (_values, formApi) => {
    const allValues = formApi.getState().values;
    setFormValues(allValues);
    setIsSubmitted(true);
  };

  const handleCancel = () => {
    navigate('/scappolicies');
  };

  const handleClose = () => {
    navigate('/scappolicies');
  };

  // After submission, show progress instead of wizard
  if (isSubmitted) {
    return <FinishedStep values={formValues} onClose={handleClose} />;
  }

  return (
    <FormRenderer
      schema={schema}
      componentMapper={componentMapper}
      FormTemplate={(props) => (
        <FormTemplate {...props} showFormControls={false} />
      )}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default CreatePolicyWizard;
