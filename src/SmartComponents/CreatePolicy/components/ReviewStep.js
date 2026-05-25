import React from 'react';
import { useFormApi } from '@data-driven-forms/react-form-renderer';
import { Content, ContentVariants } from '@patternfly/react-core';

const ReviewStep = () => {
  const { getState } = useFormApi();
  const { values } = getState();

  const profile = values.profile;
  const osMajorVersion = profile?.os_major_version;
  const osMinorVersionCounts = values.osMinorVersionCounts || [];
  const totalSystemsCount = (values.systems || []).length;

  return (
    <Content>
      <Content component={ContentVariants.h1}>Review</Content>
      <Content component="p">Review your SCAP policy before finishing.</Content>
      <Content component={ContentVariants.h3}>{values.name}</Content>
      <Content
        component={ContentVariants.dl}
        className="pf-u-mt-md"
        style={{ gridTemplateColumns: 'auto 1fr' }}
      >
        <Content component={ContentVariants.dt}>Policy type</Content>
        <Content component={ContentVariants.dd}>{profile?.title}</Content>

        <Content component={ContentVariants.dt} className="pf-v6-u-text-nowrap">
          Compliance threshold
        </Content>
        <Content component={ContentVariants.dd}>
          {values.complianceThreshold || 100}%
        </Content>

        {values.businessObjective && (
          <React.Fragment>
            <Content component={ContentVariants.dt}>Business objective</Content>
            <Content component={ContentVariants.dd}>
              {values.businessObjective}
            </Content>
          </React.Fragment>
        )}

        <Content component={ContentVariants.dt}>Systems</Content>
        <Content component={ContentVariants.dd}>{totalSystemsCount}</Content>

        <Content component={ContentVariants.dt}>RHEL OS Versions</Content>
        <Content component={ContentVariants.dd}>
          {totalSystemsCount > 0
            ? osMinorVersionCounts
                .map(
                  ({ osMinorVersion }) => `${osMajorVersion}.${osMinorVersion}`,
                )
                .join(', ')
            : '—'}
        </Content>
      </Content>
    </Content>
  );
};

export default ReviewStep;
