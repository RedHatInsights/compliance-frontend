import React from 'react';
import propTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';
import usePolicyQuery from 'Utilities/hooks/usePolicyQuery';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import ModalFormTemplate from './components/ModalFormTemplate';
import useEditPolicy from './hooks/useEditPolicy';
import { formComponentMapper, formSchema } from './constants';

export const EditPolicy = ({ route }) => {
  const { policy_id: policyId } = useParams();
  const {
    data: { profile: policy } = {},
    error,
    loading,
  } = usePolicyQuery({ policyId });
  const navigate = useNavigate();
  const navigateToPolicies = () => navigate('/scappolicies');
  const { isSaving, onSave, initialValues } = useEditPolicy(policy, {
    onSave,
  });

  useTitleEntity(route, policy?.name);

  return (
    <FormRenderer
      FormTemplate={(props) => (
        <ModalFormTemplate
          {...props}
          policy={policy}
          loading={loading}
          error={error}
          isSaving={isSaving}
          onClose={navigateToPolicies}
        />
      )}
      componentMapper={formComponentMapper}
      schema={formSchema}
      onSubmit={onSave}
      initialValues={initialValues}
    />
  );
};

EditPolicy.propTypes = {
  route: propTypes.object,
};

export default EditPolicy;
