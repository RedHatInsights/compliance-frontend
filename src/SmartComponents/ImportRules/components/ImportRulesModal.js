import React, { useCallback } from 'react';
import propTypes from 'prop-types';
import { Button, Bullseye, Spinner } from '@patternfly/react-core';
import { ModalVariant } from '@patternfly/react-core/deprecated';
import useInsightsNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

import {
  ComplianceModal,
  StateViewWithError,
  StateViewPart,
} from 'PresentationalComponents';

const ImportRulesModal = ({
  policyId,
  stateValues,
  children,
  onSave,
  onCancel,
  isSaveDisabled,
  ...modalProps
}) => {
  const navigate = useInsightsNavigate();
  const navigateToPolicyRules = useCallback(() => {
    navigate(`/scappolicies/${policyId}#rules`);
  }, [policyId, navigate]);

  return (
    <ComplianceModal
      isOpen
      variant={ModalVariant.medium}
      actions={[
        <Button
          key="save"
          ouiaId="SaveImportButton"
          aria-label="save"
          onClick={() => onSave?.()}
          isDisabled={isSaveDisabled}
        >
          Save
        </Button>,
        <Button
          key="cancel"
          ouiaId="DeleteReportCancelButton"
          variant="secondary"
          onClick={navigateToPolicyRules}
        >
          Cancel
        </Button>,
      ]}
      onClose={navigateToPolicyRules}
      {...modalProps}
    >
      <StateViewWithError stateValues={stateValues}>
        <StateViewPart stateKey="loading">
          <Bullseye>
            <Spinner />
          </Bullseye>
        </StateViewPart>
        <StateViewPart stateKey="data">{children}</StateViewPart>
      </StateViewWithError>
    </ComplianceModal>
  );
};

ImportRulesModal.propTypes = {
  policyId: propTypes.string,
  stateValues: propTypes.object,
  children: propTypes.node,
  onSave: propTypes.func,
  onCancel: propTypes.func,
  isSaveDisabled: propTypes.bool,
};

export default ImportRulesModal;
