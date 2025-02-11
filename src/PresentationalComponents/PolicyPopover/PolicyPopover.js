import React from 'react';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import {
  Button,
  Popover,
  Text,
  TextList,
  TextListVariants,
  TextListItem,
  TextListItemVariants,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { fixedPercentage } from 'Utilities/TextHelper';
import { LinkWithPermission as Link } from 'PresentationalComponents';
import propTypes from 'prop-types';

const PolicyPopover = ({ report, position = 'top' }) => {
  const {
    id: reportId,
    title,
    profile_title,
    compliance_threshold,
    os_major_version,
    business_objective,
  } = report;
  return (
    <Popover
      {...{ position }}
      headerContent={
        <TextContent>
          {title}
          <Text component={TextVariants.small}>{profile_title}</Text>
        </TextContent>
      }
      footerContent={
        <Link to={'/scappolicies/' + reportId} className="pf-v5-u-font-size-md">
          View policy
        </Link>
      }
      bodyContent={
        <TextContent className="policy-details">
          <TextList component={TextListVariants.dl}>
            <TextListItem component={TextListItemVariants.dt}>
              Operating system
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
              RHEL {os_major_version}
            </TextListItem>
            <TextListItem component={TextListItemVariants.dt}>
              Compliance threshold
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
              {fixedPercentage(compliance_threshold, 1)}
            </TextListItem>
            {business_objective && (
              <React.Fragment>
                <TextListItem component={TextListItemVariants.dt}>
                  Business objective
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                  {business_objective}
                </TextListItem>
              </React.Fragment>
            )}
          </TextList>
        </TextContent>
      }
    >
      <Button variant="link" ouiaId="PopoverViewPolicyLink" isInline>
        <OutlinedQuestionCircleIcon className="grey-icon" />
      </Button>
    </Popover>
  );
};

PolicyPopover.propTypes = {
  report: propTypes.object,
  position: propTypes.string,
};

export default PolicyPopover;
