import React from 'react';
import propTypes from 'prop-types';
import {
  Grid,
  GridItem,
  Stack,
  StackItem,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { ConditionalLink } from 'PresentationalComponents';
import RuleValueEdit from './components/RuleValueEdit';

const RuleDetailsRow = ({ item: rule, onValueChange, onRuleValueReset }) => {
  const {
    refId,
    description,
    identifier,
    references,
    rationale,
    valueDefinitions,
  } = rule;
  const key = `rule-child-row-${refId}`;

  return (
    <div key={key} style={{ marginTop: 'var(--pf-v5-global--spacer--lg)' }}>
      <Stack
        id={`rule-description-${key}`}
        style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}
      >
        <StackItem style={{ marginBottom: 'var(--pf-v5-global--spacer--xs)' }}>
          <Text className="pf-c-form__label" component={TextVariants.h5}>
            <b>Description</b>
          </Text>
        </StackItem>
        <StackItem isFilled>{description}</StackItem>
      </Stack>
      <Stack
        id={`rule-identifiers-references-${key}`}
        style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}
      >
        <Grid>
          {identifier && (
            <GridItem span={2}>
              <Text
                className="pf-c-form__label"
                component={TextVariants.h5}
                style={{ marginBottom: 'var(--pf-v5-global--spacer--xs)' }}
              >
                <b>Identifier</b>
              </Text>
              <Text>
                <ConditionalLink href={identifier.system} target="_blank">
                  {identifier.label}
                </ConditionalLink>
              </Text>
            </GridItem>
          )}

          {references && references.length > 0 && (
            <GridItem span={10}>
              <Text
                className="pf-c-form__label"
                component={TextVariants.h5}
                style={{ marginBottom: 'var(--pf-v5-global--spacer--xs)' }}
              >
                <b>References</b>
              </Text>
              <Text>
                {references
                  .map((ref, idx) => (
                    <ConditionalLink
                      href={ref.href}
                      target="_blank"
                      key={`${refId}-reference-${idx}`}
                    >
                      {ref.label}
                    </ConditionalLink>
                  ))
                  .reduce((prev, next) => [prev, ', ', next])}
              </Text>
            </GridItem>
          )}
        </Grid>
      </Stack>

      {rationale && (
        <Stack
          id={`rule-rationale-${key}`}
          style={{ marginBottom: 'var(--pf-v5-global--spacer--lg)' }}
        >
          <StackItem
            style={{ marginBottom: 'var(--pf-v5-global--spacer--xs)' }}
          >
            <Text className="pf-c-form__label" component={TextVariants.h5}>
              <b>Rationale</b>
            </Text>
          </StackItem>
          <StackItem isFilled>{rationale}</StackItem>
        </Stack>
      )}

      {valueDefinitions?.length > 0 && (
        <RuleValueEdit
          rule={rule}
          key={key}
          onValueChange={onValueChange}
          onRuleValueReset={onRuleValueReset}
        />
      )}
    </div>
  );
};

RuleDetailsRow.propTypes = {
  item: propTypes.object,
  onValueChange: propTypes.func,
  onRuleValueReset: propTypes.func,
};

export default RuleDetailsRow;
