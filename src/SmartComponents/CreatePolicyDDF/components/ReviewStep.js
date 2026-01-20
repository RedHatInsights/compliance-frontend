import React from 'react';
import { useFormApi } from '@data-driven-forms/react-form-renderer';
import { Content, ContentVariants, Label } from '@patternfly/react-core';

const ReviewStep = () => {
  const { getState } = useFormApi();
  const { values } = getState();

  const profile = values.profile;
  const osMajorVersion = profile?.os_major_version;
  const osMinorVersionCounts = values.osMinorVersionCounts || [];

  return (
    <Content>
      <Content component={ContentVariants.h1}>Review</Content>
      <Content component="p">Review your SCAP policy before finishing.</Content>
      <Content component={ContentVariants.h3}>{values.name}</Content>
      <Content component={ContentVariants.dl} className="pf-u-mt-md">
        <Content component={ContentVariants.dt}>Policy type</Content>
        <Content component={ContentVariants.dd}>{profile?.title}</Content>

        <Content component={ContentVariants.dt}>Compliance threshold</Content>
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
        <Content component={ContentVariants.dd}>
          {osMinorVersionCounts.length > 0 ? (
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
          ) : (
            '—'
          )}
        </Content>
      </Content>
    </Content>
  );
};

export default ReviewStep;
