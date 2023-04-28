import React, { useState } from 'react';
import propTypes from 'prop-types';
import {
  Stack,
  StackItem,
  Text,
  TextVariants,
  Button,
} from '@patternfly/react-core';
import { PencilAltIcon, RedoIcon } from '@patternfly/react-icons';
import { useResetValues } from '../hooks';
import InlineValueEdit from './InlineValueEdit';

const RuleValueEdit = ({ rule, onValueChange, onRuleValueReset }) => {
  const {
    valueDefinitions,
    profile: { id: policyId },
    ruleValues,
  } = rule;
  const [editValues, setEditValues] = useState(false);
  const enableAllEdit = valueDefinitions.length === 1;
  const onValueSave = (valueDefinition) => (newValue) => {
    onValueChange?.(policyId, valueDefinition, newValue);
  };

  const { resetValues, nonDefaultValues } = useResetValues(
    policyId,
    ruleValues,
    valueDefinitions,
    onRuleValueReset
  );

  return (
    <Stack style={{ marginBottom: 'var(--pf-global--spacer--lg)' }}>
      <StackItem style={{ marginBottom: 'var(--pf-global--spacer--xs)' }}>
        <Text className="pf-c-form__label" component={TextVariants.h5}>
          <b>Depends on values</b>{' '}
          {enableAllEdit && (
            <Button
              className="pf-u-ml-sm"
              onClick={() => {
                setEditValues((current) => !current);
              }}
              variant="plain"
            >
              <PencilAltIcon />
            </Button>
          )}
          {nonDefaultValues && (
            <Button
              className="pf-u-ml-sm"
              onClick={resetValues}
              variant="plain"
            >
              <RedoIcon />
            </Button>
          )}
        </Text>

        {valueDefinitions.map((valueDefinition, idx) => (
          <InlineValueEdit
            key={`rule-value-${idx}`}
            isOpen={editValues}
            value={
              ruleValues?.[valueDefinition.id] ||
              ruleValues?.[valueDefinition.refId]
            }
            valueDefinition={valueDefinition}
            onSave={onValueSave(valueDefinition)}
            enableEdit={!enableAllEdit}
          />
        ))}
      </StackItem>
    </Stack>
  );
};

RuleValueEdit.propTypes = {
  rule: propTypes.object,
  key: propTypes.object,
  onValueChange: propTypes.func,
  onRuleValueReset: propTypes.func,
};

export default RuleValueEdit;
