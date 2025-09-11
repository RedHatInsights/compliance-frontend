import React from 'react';
import propTypes from 'prop-types';
import { Button, Bullseye, Spinner } from '@patternfly/react-core';
import { ModalVariant } from '@patternfly/react-core/deprecated';

import {
  ComplianceModal,
  StateViewWithError,
  StateViewPart,
} from 'PresentationalComponents';

const ImportRulesModal = ({
  stateValues,
  children,
  onSave,
  onCancel,
  isSaveDisabled,
  ...modalProps
}) => (
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
        onClick={() => onCancel?.()}
      >
        Cancel
      </Button>,
    ]}
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

ImportRulesModal.propTypes = {
  stateValues: propTypes.object,
  children: propTypes.node,
  onSave: propTypes.func,
  onCancel: propTypes.func,
  isSaveDisabled: propTypes.bool,
};

export default ImportRulesModal;
