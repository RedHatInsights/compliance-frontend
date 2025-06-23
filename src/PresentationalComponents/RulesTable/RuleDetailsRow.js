import React from 'react';
import propTypes from 'prop-types';
import {
  Grid,
  GridItem,
  Stack,
  StackItem,
  Content,
  ContentVariants,
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
    <div key={key} style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}>
      <Stack
        id={`rule-description-${key}`}
        style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}
      >
        <StackItem style={{ marginBottom: 'var(--pf-t--global--spacer--xs)' }}>
          <Content className="pf-c-form__label" component={ContentVariants.h5}>
            <b>Description</b>
          </Content>
        </StackItem>
        <StackItem isFilled>{description}</StackItem>
      </Stack>
      <Stack
        id={`rule-identifiers-references-${key}`}
        style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}
      >
        <Grid>
          {identifier && (
            <GridItem span={2}>
              <Content
                className="pf-c-form__label"
                component={ContentVariants.h5}
                style={{ marginBottom: 'var(--pf-t--global--spacer--xs)' }}
              >
                <b>Identifier</b>
              </Content>
              <Content component="p">
                <ConditionalLink href={identifier.system} target="_blank">
                  {identifier.label}
                </ConditionalLink>
              </Content>
            </GridItem>
          )}

          {references && references.length > 0 && (
            <GridItem span={10}>
              <Content
                className="pf-c-form__label"
                component={ContentVariants.h5}
                style={{ marginBottom: 'var(--pf-t--global--spacer--xs)' }}
              >
                <b>References</b>
              </Content>
              <Content component="p">
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
              </Content>
            </GridItem>
          )}
        </Grid>
      </Stack>

      {rationale && (
        <Stack
          id={`rule-rationale-${key}`}
          style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}
        >
          <StackItem
            style={{ marginBottom: 'var(--pf-t--global--spacer--xs)' }}
          >
            <Content
              className="pf-c-form__label"
              component={ContentVariants.h5}
            >
              <b>Rationale</b>
            </Content>
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
