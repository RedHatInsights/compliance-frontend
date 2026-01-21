import React from 'react';
import { componentMapper } from '@data-driven-forms/pf4-component-mapper';
import { useFormApi } from '@data-driven-forms/react-form-renderer';
import CreateSCAPPolicyStep from './components/CreateSCAPPolicyStep';
import DetailsStep from './components/DetailsStep';
import SystemsStep from './components/SystemsStep';
import RulesStep from './components/RulesStep';
import ReviewStep from './components/ReviewStep';
import FinishedStep from './components/FinishedStep';

const FinishedStepWrapper = () => {
  const formApi = useFormApi();
  const values = formApi.getState().values;
  const onClose = () => formApi.onCancel();

  return <FinishedStep values={values} onClose={onClose} />;
};

const customComponentMapper = {
  ...componentMapper,
  'create-scap-policy-step': CreateSCAPPolicyStep,
  'details-step': DetailsStep,
  'systems-step': SystemsStep,
  'rules-step': RulesStep,
  'review-step': ReviewStep,
  'finished-step': FinishedStepWrapper,
};

export default customComponentMapper;
