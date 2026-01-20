import React from 'react';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';
import CreatePolicy from './CreatePolicy';
import CreatePolicyDDF from '../CreatePolicyDDF';

const CreatePolicyWrapper = () => {
  const isDDFEnabled = useFeatureFlag('compliance.data-driven-forms');
  console.log('Is data driven forms enabled?', isDDFEnabled);

  return isDDFEnabled ? <CreatePolicyDDF /> : <CreatePolicy />;
};

export default CreatePolicyWrapper;
