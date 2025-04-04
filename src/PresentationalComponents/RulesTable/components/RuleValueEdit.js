import React, { useState } from 'react';
import propTypes from 'prop-types';
import {
  Stack,
  StackItem,
  Text,
  TextVariants,
  Button,
} from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import InlineValueEdit from './InlineValueEdit';

const RuleValueEdit = ({
  rule,
  onValueChange,
  // onRuleValueReset
}) => {
  const {
    valueDefinitions,
    profile: { id: policyId },
    ruleValues,
  } = rule;
  const [isOpen, setIsOpen] = useState(false);
  const enableAllEdit = valueDefinitions.length === 1;

  const closeInlineEdit = () => {
    setIsOpen(false);
  };

  const onValueSave = (valueDefinition) => (newValue) => {
    onValueChange?.(policyId, valueDefinition, newValue, closeInlineEdit);
  };

  // TODO This still used GQL and didn't work anymore
  // const { resetValues, nonDefaultValues } = useResetValues(
  //   policyId,
  //   ruleValues,
  //   valueDefinitions,
  //   onRuleValueReset
  // );

  return (
    <Stack style={{ marginBottom: 'var(--pf-v5-global--spacer--lg)' }}>
      <StackItem style={{ marginBottom: 'var(--pf-v5-global--spacer--xs)' }}>
        <Text className="pf-v5-c-form__label" component={TextVariants.h5}>
          <b>Depends on values</b>{' '}
          {enableAllEdit && (
            <Button
              aria-label="Edit value button"
              ouiaId="InlineEditPencil"
              className="pf-v5-u-ml-sm"
              onClick={() => {
                setIsOpen((current) => !current);
              }}
              variant="plain"
            >
              <PencilAltIcon />
            </Button>
          )}
          {/*
            * nonDefaultValues && (
            <Button
              aria-label="Reset value button"
              ouiaId="InlineEditReset"
              className="pf-v5-u-ml-sm"
              onClick={resetValues}
              variant="plain"
            >
              <RedoIcon />
            </Button>
          )*/}
        </Text>

        {valueDefinitions.map((valueDefinition, idx) => (
          <InlineValueEdit
            key={`rule-value-${idx}`}
            isOpen={isOpen}
            value={
              valueDefinition.value ||
              ruleValues?.[valueDefinition?.id] ||
              ruleValues?.[valueDefinition?.refId]
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
