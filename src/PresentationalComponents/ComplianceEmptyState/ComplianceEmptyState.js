import React from 'react';
import propTypes from 'prop-types';
import InsightsLink from '@redhat-cloud-services/frontend-components/InsightsLink';
import {
  TextContent,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateActions,
  EmptyStateHeader,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { CloudSecurityIcon } from '@patternfly/react-icons';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import { ErrorCard } from 'PresentationalComponents';
import usePolicies from 'Utilities/hooks/api/usePolicies';

const ComplianceEmptyState = ({ title, mainButton }) => {
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
      style={{
        '--pf-v5-c-empty-state__icon--FontSize':
          'var(--pf-v5-c-empty-state--m-xl__icon--FontSize)',
      }}
    >
      <EmptyStateHeader
        titleText={<>{title}</>}
        icon={
          <EmptyStateIcon
            style={{
              fontWeight: '500',
              color: 'var(--pf-v5-global--primary-color--100)',
            }}
            icon={CloudSecurityIcon}
          />
        }
        headingLevel="h2"
      />
      <EmptyStateBody>
        {policiesCount > 0 ? (
          <TextContent>
            <InsightsLink to="/scappolicies">
              {policiesCount} {policyWord}
            </InsightsLink>{' '}
            {haveWord} been created but {haveWord} no reports.
          </TextContent>
        ) : (
          <></>
        )}
        <TextContent>
          The Compliance service uses SCAP policies to track your
          organization&#39;s adherence to compliance requirements.
        </TextContent>
        <TextContent>
          Get started by adding a policy, or read documentation about how to
          connect OpenSCAP to the Compliance service.
        </TextContent>
      </EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>{mainButton}</EmptyStateActions>
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

ComplianceEmptyState.defaultProps = {
  title: 'No policies',
  mainButton: (
    <Button
      variant="primary"
      component="a"
      href="/insights/compliance/scappolicies"
    >
      Create new policy
    </Button>
  ),
};

export default ComplianceEmptyState;
