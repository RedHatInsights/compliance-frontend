import React from 'react';
import propTypes from 'prop-types';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import {
  Popover,
  Flex,
  Content,
  ContentVariants,
  Icon,
} from '@patternfly/react-core';
import {
  ExternalLinkAltIcon,
  OutlinedQuestionCircleIcon,
} from '@patternfly/react-icons';

const CompliancePageHeader = ({ mainTitle, popoverData }) => {
  return (
    <PageHeader className="page-header">
      <PageHeaderTitle
        title={
          <React.Fragment>
            {mainTitle}
            <Popover
              headerContent={popoverData.headerContent}
              bodyContent={
                <Content>
                  <Flex direction={{ default: 'column' }}>
                    <Content component={ContentVariants.p}>
                      {popoverData.bodyContent}
                    </Content>
                    <Content component={ContentVariants.p}>
                      <a
                        rel="noreferrer"
                        target="_blank"
                        href={popoverData.bodyLink}
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
              <Icon data-testid="compliance-header-popover-icon">
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
  );
};

CompliancePageHeader.propTypes = {
  mainTitle: propTypes.string.isRequired,
  popoverData: propTypes.shape({
    headerContent: propTypes.string.isRequired,
    bodyContent: propTypes.string.isRequired,
    bodyLink: propTypes.string.isRequired,
  }).isRequired,
};

export default CompliancePageHeader;
