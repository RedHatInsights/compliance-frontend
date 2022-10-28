import React, { useMemo } from 'react';
import propTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import RemediationButton from '@redhat-cloud-services/frontend-components-remediations/RemediationButton';
import { dispatchNotification } from 'Utilities/Dispatcher';
import { provideData } from './helpers';

const ComplianceRemediationButton = ({ allSystems, selectedRules }) => {
  const remediationData = useMemo(
    () =>
      provideData({
        systems: allSystems,
        selectedRules,
      }),
    [
      allSystems?.map(({ id }) => id).join(),
      selectedRules?.map(({ refId }) => refId).join(),
    ]
  );

  return (
    <RemediationButton
      isDisabled={!(remediationData.issues?.length > 0)}
      onRemediationCreated={(result) =>
        dispatchNotification(result.getNotification())
      }
      dataProvider={async () => remediationData}
      buttonProps={{
        ouiaId: 'RemediateButton',
      }}
      fallback={
        <Button variant="primary" isDisabled>
          Remediate
        </Button>
      }
    >
      Remediate
    </RemediationButton>
  );
};

ComplianceRemediationButton.propTypes = {
  selectedRules: propTypes.array,
  allSystems: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.string,
      name: propTypes.string,
      supported: propTypes.bool.isRequired,
      profiles: propTypes.arrayOf(
        propTypes.shape({
          refId: propTypes.string,
          name: propTypes.string,
          rules: propTypes.arrayOf(
            propTypes.shape({
              title: propTypes.string,
              severity: propTypes.string,
              rationale: propTypes.string,
              refId: propTypes.string,
              description: propTypes.string,
              compliant: propTypes.bool,
              identifier: propTypes.string,
              references: propTypes.string,
            })
          ),
        })
      ),
    })
  ),
  addNotification: propTypes.func,
};

export default ComplianceRemediationButton;
