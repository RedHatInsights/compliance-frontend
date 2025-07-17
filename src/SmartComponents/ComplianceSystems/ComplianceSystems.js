import React from 'react';
import {
  Flex,
  Alert,
  Popover,
  Icon,
  Content,
  ContentVariants,
} from '@patternfly/react-core';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import { StateViewPart, StateViewWithError } from 'PresentationalComponents';
import { SystemsTable } from 'SmartComponents';
import * as Columns from '../SystemsTable/Columns';
import usePolicies from 'Utilities/hooks/api/usePolicies';
import {
  ExternalLinkAltIcon,
  OutlinedQuestionCircleIcon,
} from '@patternfly/react-icons';

const ComplianceSystems = () => {
  const navigateToInventory = useNavigate('inventory');
  const { data, error, loading } = usePolicies();
  const policies = data?.data;

  return (
    <React.Fragment>
      <PageHeader className="page-header">
        <PageHeaderTitle
          title={
            <React.Fragment>
              Systems
              <Popover
                headerContent="Systems list"
                bodyContent={
                  <Content>
                    <Flex direction={{ default: 'column' }}>
                      <Content component={ContentVariants.p}>
                        This list shows systems that have the necessary packages
                        to successfully run Insights compliance scans.
                      </Content>
                      <Content component={ContentVariants.p}>
                        <a
                          rel="noreferrer"
                          target="_blank"
                          href={
                            'https://docs.redhat.com/en/documentation/red_hat_insights/1-latest/html-single/' +
                            'assessing_and_monitoring_security_policy_compliance_of_rhel_systems/' +
                            'index#compliance-getting-started_intro-compliance'
                          }
                        >
                          Learn more
                          <Icon className="pf-v6-u-ml-xs">
                            <ExternalLinkAltIcon />
                          </Icon>
                        </a>
                      </Content>
                    </Flex>
                  </Content>
                }
              >
                <Icon>
                  <OutlinedQuestionCircleIcon
                    className="grey-icon pf-v6-u-ml-md"
                    style={{
                      verticalAlign: 0,
                      fontSize: 16,
                      cursor: 'pointer',
                    }}
                  />
                </Icon>
              </Popover>
            </React.Fragment>
          }
        />
      </PageHeader>
      <section className="pf-v6-c-page__main-section">
        <StateViewWithError stateValues={{ error, data: policies, loading }}>
          <StateViewPart stateKey="data">
            <Alert
              isInline
              variant="info"
              ouiaId="SystemsListIsDifferentAlert"
              title={
                'The list of systems in this view is different than those that appear in the Inventory. ' +
                'Only systems currently associated with or reporting against compliance policies are displayed.'
              }
            />
            <SystemsTable
              isFullView
              columns={[
                Columns.customName(
                  {
                    showLink: true,
                  },
                  { sortable: ['display_name'] },
                ),
                Columns.Workspaces,
                Columns.Tags,
                Columns.OS(),
                Columns.Policies,
                Columns.Updated,
              ]}
              defaultFilter="assigned_or_scanned=true"
              filters={{
                policies,
                groups: true,
              }}
              actions={[
                {
                  title: 'View in inventory',
                  onClick: (_event, _index, { id }) =>
                    navigateToInventory('/' + id),
                },
              ]}
              onSelect={true}
            />
          </StateViewPart>
        </StateViewWithError>
      </section>
    </React.Fragment>
  );
};

export default ComplianceSystems;
