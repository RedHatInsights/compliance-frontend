import React from 'react';
import propTypes from 'prop-types';
import InsightsLink from '@redhat-cloud-services/frontend-components/InsightsLink';
import {
  Content,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateActions,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { CloudSecurityIcon } from '@patternfly/react-icons';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import { ErrorCard } from 'PresentationalComponents';
import usePolicies from 'Utilities/hooks/api/usePolicies';

const ComplianceEmptyState = ({ title = 'No policies', mainButton }) => {
  const { data, error, loading } = usePolicies({ params: { limit: 1 } });
  const policiesCount = data?.meta?.total || 0;

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    const errorMsg = `Oops! Error loading System data: ${error}`;
    return <ErrorCard errorMsg={errorMsg} />;
  }

  const policyWord = policiesCount > 1 ? 'policies' : 'policy';
  const haveWord = policiesCount > 1 ? 'have' : 'has';

  return (
    <EmptyState
      headingLevel="h2"
      icon={CloudSecurityIcon}
      titleText={<>{title}</>}
      style={{
        '--pf-v6-c-empty-state__icon--FontSize':
          'var(--pf-v6-c-empty-state--m-xl__icon--FontSize)',
      }}
    >
      <EmptyStateBody>
        {policiesCount > 0 ? (
          <Content>
            <InsightsLink to="/scappolicies">
              {policiesCount} {policyWord}
            </InsightsLink>{' '}
            {haveWord} been created but {haveWord} no reports.
          </Content>
        ) : (
          <></>
        )}
        <Content>
          The Compliance service uses SCAP policies to track your
          organization&#39;s adherence to compliance requirements.
        </Content>
        <Content>
          Get started by adding a policy, or read documentation about how to
          connect OpenSCAP to the Compliance service.
        </Content>
      </EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          {mainButton ? (
            mainButton
          ) : (
            <Button
              variant="primary"
              component="a"
              href="/insights/compliance/scappolicies"
            >
              Create new policy
            </Button>
          )}
        </EmptyStateActions>
        <EmptyStateActions>
          <Button
            variant="link"
            component="a"
            target="_blank"
            rel="noopener noreferrer"
            href={
              `https://access.redhat.com/documentation/en-us/red_hat_insights/` +
              `1-latest/html/assessing_and_monitoring_security_policy_compliance_of_rhel_systems/index`
            }
          >
            Learn about OpenSCAP and Compliance
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

ComplianceEmptyState.propTypes = {
  title: propTypes.string,
  mainButton: propTypes.object,
};

export default ComplianceEmptyState;
