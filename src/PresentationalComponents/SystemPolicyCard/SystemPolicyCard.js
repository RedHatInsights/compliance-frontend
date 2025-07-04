import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  CardFooter,
  Content,
  ContentVariants,
  Tooltip,
} from '@patternfly/react-core';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import Truncate from '@redhat-cloud-services/frontend-components/Truncate';
import UnsupportedSSGVersionAlert from './components/UnsupportedSSGVersionAlert';
import CompliantIcon from './components/CompliantIcon';

const SystemPolicyCard = ({ policy, style }) => {
  const {
    rulesFailed,
    compliant,
    lastScanned,
    score,
    benchmark: { version: ssgVersion },
    supported,
    name,
    policyType,
  } = policy;
  const passedPercentage = ((value, fixed = 0, withPercent = true) =>
    Number(value).toFixed(fixed) + (withPercent ? '%' : ''))(score);

  const truncateDefaults = { expandOnMouseOver: true, hideExpandText: true };

  return (
    <Card ouiaId="PolicyCard" style={style}>
      <CardBody>
        <Content className="margin-bottom-md">
          <Content
            ouiaId="PolicyCardName"
            className="margin-bottom-top-none"
            component={ContentVariants.h4}
          >
            <Truncate text={name} length={110} {...truncateDefaults} />
          </Content>
          <Content
            ouiaId="PolicyCardType"
            style={{
              color: 'var(pf-t--global--text--color--200)',
            }}
            component={ContentVariants.small}
          >
            <Truncate text={policyType} length={110} {...truncateDefaults} />
          </Content>
        </Content>
        <div className="margin-bottom-md">
          {supported && <CompliantIcon compliant={compliant} />}
          <Content
            ouiaId="PolicyCardFailedRulesScore"
            component={ContentVariants.small}
          >
            {rulesFailed} rule{rulesFailed === 1 ? '' : 's'} failed{' '}
            <Tooltip
              position="bottom"
              maxWidth="22em"
              content={
                'The system compliance score is calculated by OpenSCAP and ' +
                'is a normalized weighted sum of rules selected for this policy.'
              }
            >
              <span>
                (Score: {supported ? passedPercentage : 'Unsupported'})
              </span>
            </Tooltip>
          </Content>
        </div>
        <Content
          className="margin-bottom-none"
          component={ContentVariants.small}
        >
          <Content component="p" ouiaId="PolicyCardSSGVersion">
            SSG version: {ssgVersion}
          </Content>
          <Content component="p" ouiaId="PolicyCardLastScanned">
            Last scanned:{' '}
            {lastScanned !== 'Never' ? (
              <DateFormat date={Date.parse(lastScanned)} type="relative" />
            ) : (
              lastScanned
            )}
          </Content>
        </Content>
      </CardBody>
      {!supported && (
        <CardFooter style={{ padding: '0' }}>
          <UnsupportedSSGVersionAlert
            ouiaId="PolicyCardUnsupportedSSG"
            ssgVersion={ssgVersion}
            style={{
              paddingTop: 'var(--pf-v6-c-alert--PaddingTop)',
              paddingRight: 'var(--pf-v6-c-card--child--PaddingRight)',
              paddingLeft: 'var(--pf-v6-c-card--child--PaddingLeft)',
              paddingBottom: 'var(--pf-v6-c-alert--PaddingBottom)',
            }}
          />
        </CardFooter>
      )}
    </Card>
  );
};

SystemPolicyCard.propTypes = {
  policy: PropTypes.shape({
    rulesPassed: PropTypes.number,
    rulesFailed: PropTypes.number,
    score: PropTypes.number,
    lastScanned: PropTypes.string,
    refId: PropTypes.string,
    name: PropTypes.string,
    policyType: PropTypes.string,
    compliant: PropTypes.bool,
    benchmark: PropTypes.object,
    supported: PropTypes.bool,
  }),
  style: PropTypes.object,
};

export default SystemPolicyCard;
