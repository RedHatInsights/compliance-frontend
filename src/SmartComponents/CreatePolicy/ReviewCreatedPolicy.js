import React from 'react';
import { Label, Content, ContentVariants } from '@patternfly/react-core';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

const ReviewCreatedPolicy = ({
  name,
  businessObjective,
  complianceThreshold,
  parentProfileName,
  osMinorVersionCounts,
  osMajorVersion,
}) => (
  <Content>
    <Content component={ContentVariants.h1}>Review</Content>
    <Content component="p">Review your SCAP policy before finishing.</Content>
    <Content component={ContentVariants.h3}>{name}</Content>
    <Content component={ContentVariants.dl} className="pf-u-mt-md">
      <Content component={ContentVariants.dt}>Policy type</Content>
      <Content component={ContentVariants.dd}>{parentProfileName}</Content>
      <Content component={ContentVariants.dt}>Compliance threshold</Content>
      <Content component={ContentVariants.dd}>{complianceThreshold}%</Content>
      {businessObjective && (
        <React.Fragment>
          <Content component={ContentVariants.dt}>Business objective</Content>
          <Content component={ContentVariants.dd}>{businessObjective}</Content>
        </React.Fragment>
      )}
      <Content component={ContentVariants.dt}>Systems</Content>
      <Content component={ContentVariants.dd}>
        <Content component={ContentVariants.dl}>
          {osMinorVersionCounts.map(({ osMinorVersion, count }) => (
            <React.Fragment key={osMinorVersion}>
              <Content
                component={ContentVariants.dt}
                style={{ fontWeight: 'normal' }}
              >
                RHEL {osMajorVersion}.{osMinorVersion}
              </Content>
              <Content component={ContentVariants.dd}>
                <Label color="grey" isCompact={true}>
                  {count} {count > 1 ? 'systems' : 'system'}
                </Label>
              </Content>
            </React.Fragment>
          ))}
        </Content>
      </Content>
    </Content>
  </Content>
);

ReviewCreatedPolicy.propTypes = {
  name: propTypes.string,
  businessObjective: propTypes.string,
  complianceThreshold: propTypes.number,
  parentProfileName: propTypes.string,
  osMinorVersionCounts: propTypes.arrayOf(
    propTypes.shape({
      osMinorVersion: propTypes.number,
      count: propTypes.number,
    }),
  ),
  osMajorVersion: propTypes.string.isRequired,
};

const selector = formValueSelector('policyForm');

export default connect((state) => ({
  name: selector(state, 'name'),
  businessObjective: selector(state, 'businessObjective'),
  osMinorVersionCounts: selector(state, 'osMinorVersionCounts'),
  osMajorVersion: selector(state, 'osMajorVersion'),
  complianceThreshold:
    parseFloat(selector(state, 'complianceThreshold')) || 100.0,
  parentProfileName: selector(state, 'profile').title,
}))(ReviewCreatedPolicy);
