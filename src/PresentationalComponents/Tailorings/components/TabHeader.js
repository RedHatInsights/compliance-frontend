import React from 'react';
import propTypes from 'prop-types';
import {
  Content,
  ContentVariants,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { LinkWithPermission as Link } from 'PresentationalComponents';
import OsVersionText from '../osVersionText';
import { SSGVersionText } from '../ssgVersionText';
import ResetRules from 'PresentationalComponents/ResetRules/ResetRules';

const TabHeader = ({
  tailoring,
  securityGuide,
  profileId,
  rulesPageLink,
  showResetButton,
}) => {
  return (
    <Content className="pf-v6-u-mt-md">
      <Content component={ContentVariants.h3}>
        <span className="pf-v6-u-pr-sm">
          <OsVersionText
            profile={{
              osMajorVersion:
                tailoring?.os_major_version || securityGuide?.osMajorVersion,
              osMinorVersion:
                tailoring?.os_minor_version != null
                  ? tailoring.os_minor_version
                  : securityGuide?.osMinorVersion,
            }}
          />
        </span>
      </Content>
      <Flex>
        <FlexItem>
          <SSGVersionText
            profile={{
              osMajorVersion:
                tailoring?.os_major_version || securityGuide?.osMajorVersion,
              osMinorVersion:
                tailoring?.os_minor_version || securityGuide?.osMinorVersion,
              benchmark: {
                version:
                  tailoring?.security_guide_version || securityGuide?.version,
              },
            }}
          />
        </FlexItem>
        <FlexItem align={{ default: 'alignRight' }}>
          {showResetButton && <ResetRules />}
          {rulesPageLink && (
            <Link
              to={`/scappolicies/${profileId}/default_ruleset/${securityGuide?.id}`}
              target="_blank"
              className="pf-v6-u-mr-xl"
            >
              View policy rules
              <ExternalLinkAltIcon className="pf-v6-u-ml-sm" />
            </Link>
          )}
        </FlexItem>
      </Flex>
    </Content>
  );
};

TabHeader.propTypes = {
  tailoring: propTypes.object,
  securityGuide: propTypes.object,
  profileId: propTypes.string,
  rulesPageLink: propTypes.bool,
  showResetButton: propTypes.bool,
};

export default TabHeader;
