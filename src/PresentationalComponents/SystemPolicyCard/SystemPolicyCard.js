import React from 'react';
import PropTypes from 'prop-types';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import {
  Card,
  CardBody,
  CardFooter,
  Text,
  TextContent,
  TextVariants,
  Tooltip,
} from '@patternfly/react-core';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import Truncate from '@redhat-cloud-services/frontend-components/Truncate';
import UnsupportedSSGVersion from './UnsupportedSSGVersion';

class SystemPolicyCard extends React.Component {
  complianceIcon = (compliant) =>
    compliant ? (
      <div className="ins-c-policy-card ins-m-compliant">
        <CheckCircleIcon /> Compliant
      </div>
    ) : (
      <div className="ins-c-policy-card ins-m-noncompliant">
        <ExclamationCircleIcon /> Not compliant
      </div>
    );

  fixedPercentage = (value, fixed = 0, withPercent = true) =>
    value.toFixed(fixed) + (withPercent ? '%' : '');

  render() {
    const { policy, style, onClick, isSelected } = this.props;
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
    const passedPercentage = this.fixedPercentage(score);
    const truncateDefaults = { expandOnMouseOver: true, hideExpandText: true };

    return (
      <Card
        ouiaId="PolicyCard"
        onClick={(event) => {
          event.stopPropagation();
          onClick(policy);
        }}
        isSelected={isSelected}
        style={style}
      >
        <CardBody>
          <TextContent className="margin-bottom-md">
            <Text
              ouiaId="PolicyCardName"
              className="margin-bottom-top-none"
              component={TextVariants.h4}
            >
              <Truncate text={name} length={110} {...truncateDefaults} />
            </Text>
            <Text
              ouiaId="PolicyCardType"
              style={{ color: 'var(--pf-global--Color--200)' }}
              component={TextVariants.small}
            >
              <Truncate text={policyType} length={110} {...truncateDefaults} />
            </Text>
          </TextContent>
          <div className="margin-bottom-md">
            {supported && this.complianceIcon(compliant)}
            <Text
              ouiaId="PolicyCardFailedRulesScore"
              component={TextVariants.small}
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
            </Text>
          </div>
          <Text className="margin-bottom-none" component={TextVariants.small}>
            <Text ouiaId="PolicyCardSSGVersion">SSG version: {ssgVersion}</Text>
            <Text ouiaId="PolicyCardLastScanned">
              Last scanned:{' '}
              {lastScanned !== 'Never' ? (
                <DateFormat date={Date.parse(lastScanned)} type="relative" />
              ) : (
                lastScanned
              )}
            </Text>
          </Text>
        </CardBody>
        {!supported && (
          <CardFooter style={{ padding: '0' }}>
            <UnsupportedSSGVersion
              ouiaId="PolicyCardUnsupportedSSG"
              ssgVersion={ssgVersion}
              style={{
                paddingTop: 'var(--pf-c-alert--PaddingTop)',
                paddingRight: 'var(--pf-c-card--child--PaddingRight)',
                paddingLeft: 'var(--pf-c-card--child--PaddingLeft)',
                paddingBottom: 'var(--pf-c-alert--PaddingBottom)',
              }}
            />
          </CardFooter>
        )}
      </Card>
    );
  }
}

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
    benchmark: PropTypes.string,
    supported: PropTypes.bool,
  }),
  style: PropTypes.object,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
};

export default SystemPolicyCard;
