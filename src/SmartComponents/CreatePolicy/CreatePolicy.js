import React, { useState, useMemo } from 'react';
import propTypes from 'prop-types';
import { formValueSelector, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import { Wizard } from '@patternfly/react-core/deprecated';
import usePolicies from 'Utilities/hooks/api/usePolicies';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';
import CreateSCAPPolicy from './CreateSCAPPolicy';
import { default as EditPolicyRules } from './EditPolicyProfilesRules/EditPolicyProfilesRules';
import EditPolicySystems from './EditPolicySystems';
import EditPolicyDetails from './EditPolicyDetails';
import ReviewCreatedPolicy from './ReviewCreatedPolicy';
import FinishedCreatePolicy from './FinishedCreatePolicy';
import CreatePolicyFooter from './CreatePolicyFooter';
import {
  validateSecurityGuidePage,
  validateDetailsPage,
  validateRulesPage,
  validateSystemsPage,
} from './validate';

export const CreatePolicyForm = ({
  osMajorVersion,
  complianceThreshold,
  name,
  profile,
  refId,
  selectedRuleRefIds,
  systemIds,
  reset,
}) => {
  const enableHostless = useFeatureFlag('image-builder.compliance.enabled');
  const navigate = useNavigate();
  const [stepIdReached, setStepIdReached] = useState(1);
  const resetAnchor = () => {
    // TODO replace this with proper react router hooks
    const { location } = history;
    if (location?.hash) {
      history.push({ ...location, hash: '' });
    }
  };

  const onNext = ({ id }) => {
    setStepIdReached(stepIdReached < id ? id : stepIdReached);
    resetAnchor();
  };

  const onClose = () => {
    reset();
    navigate('/scappolicies');
  };

  const { data: policiesData } = usePolicies({
    params: {
      filter: `os_major_version = ${osMajorVersion}`,
    },
    skip: !refId || !osMajorVersion,
  });

  const allowNoSystems = useMemo(() => {
    return (
      enableHostless &&
      !policiesData?.data?.some(({ ref_id }) => ref_id === refId)
    );
  }, [policiesData, refId, enableHostless]);

  const steps = [
    {
      id: 1,
      name: 'Create SCAP policy',
      component: <CreateSCAPPolicy />,
      enableNext: validateSecurityGuidePage(osMajorVersion, profile),
    },
    {
      id: 2,
      name: 'Details',
      component: <EditPolicyDetails />,
      canJumpTo: stepIdReached >= 2,
      enableNext: validateDetailsPage(name, refId, complianceThreshold),
    },
    {
      id: 3,
      name: 'Systems',
      component: <EditPolicySystems allowNoSystems={allowNoSystems} />,
      canJumpTo: stepIdReached >= 3,
      enableNext: validateSystemsPage(systemIds, allowNoSystems),
    },
    {
      id: 4,
      name: 'Rules',
      component: <EditPolicyRules />,
      canJumpTo:
        validateSystemsPage(systemIds, allowNoSystems) && stepIdReached >= 4,
      enableNext: validateRulesPage(selectedRuleRefIds),
    },
    {
      id: 5,
      name: 'Review',
      component: <ReviewCreatedPolicy />,
      nextButtonText: 'Finish',
      canJumpTo:
        validateRulesPage(selectedRuleRefIds) &&
        validateSystemsPage(systemIds, allowNoSystems) &&
        stepIdReached >= 5,
    },
    {
      id: 6,
      name: 'Finished',
      component: <FinishedCreatePolicy onWizardFinish={onClose} />,
      isFinishedStep: true,
      canJumpTo:
        validateSystemsPage(systemIds, allowNoSystems) && stepIdReached >= 6,
    },
  ];

  return (
    <React.Fragment>
      <Wizard
        width={1300}
        className="compliance"
        isOpen
        onNext={onNext}
        onGoToStep={resetAnchor}
        onBack={resetAnchor}
        onClose={onClose}
        title="Create SCAP policy"
        description="Create a new policy for managing SCAP compliance"
        steps={steps}
        id="create-scap-policy-wizard"
        footer={<CreatePolicyFooter />}
      />
    </React.Fragment>
  );
};

CreatePolicyForm.propTypes = {
  osMajorVersion: propTypes.string,
  osMinorVersionCounts: propTypes.arrayOf(
    propTypes.shape({
      osMinorVersion: propTypes.number,
      count: propTypes.number,
    })
  ),
  complianceThreshold: propTypes.string,
  businessObjective: propTypes.object,
  dispatch: propTypes.func,
  isOpen: propTypes.bool,
  name: propTypes.string,
  onWizardFinish: propTypes.func,
  profile: propTypes.string,
  refId: propTypes.string,
  selectedRuleRefIds: propTypes.arrayOf(propTypes.string),
  systemIds: propTypes.arrayOf(propTypes.string),
  reset: propTypes.func,
};

CreatePolicyForm.defaultProps = {
  isOpen: false,
};

const CreatePolicy = reduxForm({
  form: 'policyForm',
})(CreatePolicyForm);

const selector = formValueSelector('policyForm');
export default connect((state) => ({
  osMajorVersion: selector(state, 'osMajorVersion'),
  osMinorVersionCounts: selector(state, 'osMinorVersionCounts'),
  businessObjective: selector(state, 'businessObjective'),
  complianceThreshold: selector(state, 'complianceThreshold') || 100,
  name: selector(state, 'name'),
  profile: selector(state, 'profile'),
  refId: selector(state, 'refId'),
  selectedRuleRefIds: selector(state, 'selectedRuleRefIds'),
  systemIds: selector(state, 'systems'),
}))(CreatePolicy);
