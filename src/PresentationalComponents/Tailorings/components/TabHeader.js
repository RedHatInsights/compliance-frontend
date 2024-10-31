import React from 'react';
import propTypes from 'prop-types';
import {
  Text,
  TextVariants,
  TextContent,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { LinkWithPermission as Link } from 'PresentationalComponents';
import OsVersionText from '../../TabbedRules/OsVersionText';
import { SSGVersionText } from '../../TabbedRules/ProfileTabContent';

// TODO add reset link when selecting is implemented for wizard & edit policy
const TabHeader = ({ tailoring, securityGuide, rulesPageLink }) => {
  const {
    id,
    os_major_version,
    os_minor_version,
    security_guide_version,
    version,
  } = tailoring || securityGuide;

  return (
    <TextContent className="pf-v5-u-mt-md">
      <Text component={TextVariants.h3}>
        <span className="pf-v5-u-pr-sm">
          <OsVersionText
            profile={{
              osMajorVersion: os_major_version,
              osMinorVersion: os_minor_version,
            }}
          />
        </span>
      </Text>
      <Flex>
        <FlexItem>
          <SSGVersionText
            profile={{
              osMajorVersion: os_major_version,
              osMinorVersion: os_minor_version,
              benchmark: {
                version: security_guide_version || version,
              },
            }}
          />
        </FlexItem>
        <FlexItem align={{ default: 'alignRight' }}>
          {rulesPageLink && (
            <Link
              to={`/scappolicies/${id}/default_ruleset`}
              target="_blank"
              className="pf-v5-u-mr-xl"
            >
              View policy rules
              <ExternalLinkAltIcon className="pf-v5-u-ml-sm" />
            </Link>
          )}
        </FlexItem>
      </Flex>
    </TextContent>
  );
};

TabHeader.propTypes = {
  tailoring: propTypes.object,
  securityGuide: propTypes.object,
  rulesPageLink: propTypes.bool,
};

export default TabHeader;
