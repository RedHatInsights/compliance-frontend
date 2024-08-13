import React from 'react';
import {
  Label,
  Text,
  TextVariants,
  TextContent,
  TextList,
  TextListVariants,
  TextListItem,
  TextListItemVariants,
} from '@patternfly/react-core';
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
  <TextContent>
    <Text component={TextVariants.h1}>Review</Text>
    <Text>Review your SCAP policy before finishing.</Text>
    <Text component={TextVariants.h3}>{name}</Text>
    <TextList component={TextListVariants.dl} className="pf-u-mt-md">
      <TextListItem component={TextListItemVariants.dt}>
        Policy type
      </TextListItem>
      <TextListItem component={TextListItemVariants.dd}>
        {parentProfileName}
      </TextListItem>
      <TextListItem component={TextListItemVariants.dt}>
        Compliance threshold
      </TextListItem>
      <TextListItem component={TextListItemVariants.dd}>
        {complianceThreshold}%
      </TextListItem>
      {businessObjective && (
        <React.Fragment>
          <TextListItem component={TextListItemVariants.dt}>
            Business objective
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {businessObjective}
          </TextListItem>
        </React.Fragment>
      )}
      <TextListItem component={TextListItemVariants.dt}>Systems</TextListItem>
      <TextListItem component={TextListItemVariants.dd}>
        <TextList component={TextListVariants.dl}>
          {osMinorVersionCounts.map(({ osMinorVersion, count }) => (
            <React.Fragment key={osMinorVersion}>
              <TextListItem
                component={TextListItemVariants.dt}
                style={{ fontWeight: 'normal' }}
              >
                RHEL {osMajorVersion}.{osMinorVersion}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                <Label color="grey" isCompact={true}>
                  {count} {count > 1 ? 'systems' : 'system'}
                </Label>
              </TextListItem>
            </React.Fragment>
          ))}
        </TextList>
      </TextListItem>
    </TextList>
  </TextContent>
);

ReviewCreatedPolicy.propTypes = {
  benchmarkId: propTypes.string,
  refId: propTypes.string,
  name: propTypes.string,
  businessObjective: propTypes.string,
  complianceThreshold: propTypes.number,
  parentProfileName: propTypes.string,
  osMinorVersionCounts: propTypes.arrayOf(
    propTypes.shape({
      osMinorVersion: propTypes.number,
      count: propTypes.number,
    })
  ),
  osMajorVersion: propTypes.string.isRequired,
};

const selector = formValueSelector('policyForm');

export default connect((state) => ({
  benchmarkId: selector(state, 'benchmark'),
  refId: selector(state, 'refId'),
  name: selector(state, 'name'),
  businessObjective: selector(state, 'businessObjective'),
  osMinorVersionCounts: selector(state, 'osMinorVersionCounts'),
  complianceThreshold:
    parseFloat(selector(state, 'complianceThreshold')) || 100.0,
  parentProfileName: selector(state, 'profile').name,
  rulesCount: selector(state, 'selectedRuleRefIds').length,
}))(ReviewCreatedPolicy);
