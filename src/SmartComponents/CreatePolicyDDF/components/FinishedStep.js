import React, { useState, useCallback, useEffect } from 'react';
import propTypes from 'prop-types';
import {
  Button,
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  List,
  ListItem,
  EmptyStateActions,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { WrenchIcon } from '@patternfly/react-icons';
import {
  ProgressBar,
  LinkWithPermission as Link,
} from 'PresentationalComponents';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';

import useCreatePolicy from 'Utilities/hooks/api/useCreatePolicy';
import useCreateTailoring from 'Utilities/hooks/api/useCreateTailoring';
import useAssignRules from 'Utilities/hooks/api/useAssignRules';
import useAssignSystems from 'Utilities/hooks/api/useAssignSystems';
import useTailorings from 'Utilities/hooks/api/useTailorings';
import useUpdateTailoring from 'Utilities/hooks/api/useUpdateTailoring';

const EmptyStateWithErrors = ({ errors }) =>
  errors && Array.isArray(errors) && errors.length > 0 ? (
    <EmptyStateBody className="wizard-failed-errors">
      <List>
        {errors.map((error) => (
          <ListItem key={error}>{error}</ListItem>
        ))}
      </List>
    </EmptyStateBody>
  ) : null;

EmptyStateWithErrors.propTypes = {
  errors: propTypes.array,
};

const FinishedStep = ({ values, onClose }) => {
  const addNotification = useAddNotification();

  const [percent, setPercent] = useState(0);
  const [message, setMessage] = useState('This usually takes a minute or two.');
  const [errors, setErrors] = useState(null);
  const [failed, setFailed] = useState(false);
  const [policyCreated, setPolicyCreated] = useState(false);

  const { query: createPolicy } = useCreatePolicy({ skip: true });
  const { query: assignRules } = useAssignRules({ skip: true });
  const { query: assignSystems } = useAssignSystems({ skip: true });
  const { query: fetchTailorings } = useTailorings({ skip: true });
  const { query: updateTailoring } = useUpdateTailoring({ skip: true });
  const { fetchQueue: createTailorings } = useCreateTailoring({ skip: true });

  const onProgress = useCallback((progress) => {
    setPercent(progress * 100);
  }, []);

  useEffect(() => {
    if (policyCreated) return;

    const createPolicyAsync = async () => {
      const {
        profile,
        name,
        description,
        businessObjective,
        complianceThreshold,
        systems,
        selectedRuleRefIds,
        valueOverrides = {},
      } = values;

      const cloneFromProfileId = profile.id;
      const minorVersions = selectedRuleRefIds.map(
        ({ osMinorVersion }) => osMinorVersion
      );
      const expectedUpdates =
        3 + minorVersions.length + Object.keys(valueOverrides).length;
      let progress = 0;

      const dispatchProgress = () => {
        onProgress(++progress / expectedUpdates);
      };

      try {
        // 1. Create the policy
        const createPolicyResponse = await createPolicy({
          policy: {
            title: name,
            description,
            business_objective: businessObjective,
            compliance_threshold: complianceThreshold || 100,
            profile_id: cloneFromProfileId,
          },
        });
        dispatchProgress();

        const { id: newPolicyId } = createPolicyResponse.data;

        // 2. Assign systems or create tailorings
        if (systems && systems.length > 0) {
          await assignSystems({
            policyId: newPolicyId,
            assignSystemsRequest: { ids: systems.map(({ id }) => id) },
          });
        } else {
          const tailoringsToCreate = minorVersions.map((os_minor_version) => ({
            policyId: newPolicyId,
            tailoringCreate: { os_minor_version },
          }));
          await createTailorings(tailoringsToCreate);
        }
        dispatchProgress();

        // 3. Fetch tailorings
        const fetchPolicyResponse = await fetchTailorings({
          policyId: newPolicyId,
          limit: 100,
        });
        const tailorings = fetchPolicyResponse.data;
        dispatchProgress();

        // 4. Assign rules to each tailoring
        for (const tailoring of tailorings) {
          const rulesToAssign = selectedRuleRefIds.find(
            ({ osMinorVersion }) =>
              Number(osMinorVersion) === tailoring.os_minor_version
          ).ruleRefIds;

          await assignRules({
            policyId: newPolicyId,
            tailoringId: tailoring.id,
            assignRulesRequest: {
              ids: rulesToAssign,
            },
          });
          dispatchProgress();
        }

        // 5. Update tailorings with value overrides
        for (const tailoring of tailorings) {
          const tailoringValueOverrides =
            valueOverrides[tailoring.os_minor_version];

          if (
            tailoringValueOverrides === undefined ||
            Object.keys(tailoringValueOverrides).length === 0
          ) {
            continue;
          }

          await updateTailoring({
            policyId: newPolicyId,
            tailoringId: tailoring.id,
            valuesUpdate: { value_overrides: tailoringValueOverrides },
          });
          dispatchProgress();
        }

        // Success!
        setPercent(100);
        setMessage();
        addNotification({
          variant: 'success',
          title: `Created policy "${name}"`,
          autoDismiss: true,
          description: (
            <span>
              From the <strong>SCAP Policies</strong> list, open{' '}
              <Link to={`/scappolicies/${newPolicyId}`}>{name}</Link>.
            </span>
          ),
        });
      } catch (error) {
        setMessage(error.networkError?.message || error.message);
        setErrors(error.networkError?.result?.errors);
        setFailed(true);
        addNotification({
          variant: 'danger',
          title: 'Error creating policy',
          description: error.message,
        });
      }
    };

    setPolicyCreated(true);
    createPolicyAsync();
  }, [
    policyCreated,
    values,
    createPolicy,
    assignSystems,
    createTailorings,
    fetchTailorings,
    assignRules,
    updateTailoring,
    onProgress,
    addNotification,
  ]);

  return (
    <Bullseye>
      <EmptyState
        headingLevel="h1"
        icon={WrenchIcon}
        titleText="Creating policy"
        variant={EmptyStateVariant.full}
      >
        <br />
        <EmptyStateBody>
          <ProgressBar percent={percent} failed={failed} />
        </EmptyStateBody>
        <EmptyStateFooter>
          <EmptyStateBody className={failed ? 'wizard-failed-message' : ''}>
            {message}
          </EmptyStateBody>
          <EmptyStateWithErrors errors={errors} />
          <EmptyStateActions>
            {(percent === 100 || failed) && (
              <Button
                variant="primary"
                ouiaId="ReturnToAppButton"
                onClick={onClose}
              >
                {failed ? 'Back' : 'Return to application'}
              </Button>
            )}
          </EmptyStateActions>
        </EmptyStateFooter>
      </EmptyState>
    </Bullseye>
  );
};

FinishedStep.propTypes = {
  values: propTypes.object.isRequired,
  onClose: propTypes.func.isRequired,
};

export default FinishedStep;
