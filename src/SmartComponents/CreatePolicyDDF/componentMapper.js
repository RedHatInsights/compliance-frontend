import { componentMapper } from '@data-driven-forms/pf4-component-mapper';
import CreateSCAPPolicyStep from './components/CreateSCAPPolicyStep';
import DetailsStep from './components/DetailsStep';
import SystemsStep from './components/SystemsStep';
import RulesStep from './components/RulesStep';
import ReviewStep from './components/ReviewStep';

const customComponentMapper = {
  ...componentMapper,
  'create-scap-policy-step': CreateSCAPPolicyStep,
  'details-step': DetailsStep,
  'systems-step': SystemsStep,
  'rules-step': RulesStep,
  'review-step': ReviewStep,
};

export default customComponentMapper;
