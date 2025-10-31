import React from 'react';
import propTypes from 'prop-types';
import { fixedPercentage } from 'Utilities/TextHelper';
import {
  Card,
  CardHeader,
  CardBody,
  Content,
  ContentVariants,
  TextArea,
} from '@patternfly/react-core';
import linkifyHtml from 'linkify-html';
import EditPolicyDetailsInline from '../../SmartComponents/EditPolicyDetails/EditPolicyDetailsInline';

const PolicyDetailsDescription = ({ policy, refetch }) => {
  const thresholdText = `${fixedPercentage(
    policy.compliance_threshold,
    1,
  )} of rules must be
  passed for a system to be labeled "Compliant"`;
  const businessText = policy.business_objective || '-';
  const descriptionText = linkifyHtml(policy.description || '');

  return (
    <Card ouiaId="PolicyDetailsCard">
      <CardHeader>
        <Content component="p" style={{ fontSize: 20 }}>
          <b>Policy details</b>
        </Content>
      </CardHeader>
      <CardBody>
        <Content>
          <Content component="p">
            <EditPolicyDetailsInline
              policy={policy}
              refetch={refetch}
              text={policy.compliance_threshold}
              variant="threshold"
              inlineClosedText={thresholdText}
              label="Compliance threshold (%)"
              showTextUnderInline="true"
              textUnderInline="A value of 95% or higher is recommended"
              propertyName="compliance_threshold"
              type="number"
              className="pf-v6-c-form-control pf-v6-u-w-100-on-lg"
              aria-label="editable text input"
              id="policydetails-input-threshold"
            />
          </Content>
          <Content component="p">
            <EditPolicyDetailsInline
              policy={policy}
              refetch={refetch}
              text={businessText}
              variant="business"
              inlineClosedText={businessText}
              label="Business objective"
              propertyName="business_objective"
              typeOfInput="text"
            />
          </Content>
          <Content component="p">
            <EditPolicyDetailsInline
              policy={policy}
              refetch={refetch}
              Component={TextArea}
              text={descriptionText}
              variant="description"
              inlineClosedText={descriptionText}
              label="Policy description"
              propertyName="description"
              className="pf-v6-c-form-control"
              style={{
                minWidth: '50%',
              }}
            />
          </Content>
          <Content component={ContentVariants.h5}>Operating system</Content>
          <Content component={ContentVariants.p}>
            RHEL {policy.os_major_version}
          </Content>
          <Content component={ContentVariants.h5}>Policy type </Content>
          <Content component={ContentVariants.p}>
            {policy.profile_title}
          </Content>
          <Content component={ContentVariants.h5}>Reference ID</Content>
          <Content component={ContentVariants.p}>{policy.ref_id}</Content>
        </Content>
      </CardBody>
    </Card>
  );
};
PolicyDetailsDescription.propTypes = {
  policy: propTypes.object,
  refetch: propTypes.func,
};

export default PolicyDetailsDescription;
