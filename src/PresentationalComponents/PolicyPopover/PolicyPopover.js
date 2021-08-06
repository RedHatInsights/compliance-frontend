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
    TextVariants
} from '@patternfly/react-core';
import { fixedPercentage } from 'Utilities/TextHelper';
import {
    Link
} from 'react-router-dom';
import propTypes from 'prop-types';

const PolicyPopover = ({ profile, position = 'top' }) => {
    const { policy, policyType, complianceThreshold, majorOsVersion, businessObjective } = profile;
    return (
        <Popover
            { ...{ position } }
            headerContent={
                <TextContent>
                    { policy?.name }
                    <Text component={ TextVariants.small }>{ policyType }</Text>
                </TextContent>
            }
            footerContent={
                <Link to={'/scappolicies/' + policy?.id} >
                    View policy
                </Link>
            }
            bodyContent={
                <TextContent className='policy-details'>
                    <TextList component={TextListVariants.dl}>
                        <TextListItem component={TextListItemVariants.dt}>
                            Operating system
                        </TextListItem>
                        <TextListItem component={TextListItemVariants.dd}>
                            RHEL { majorOsVersion }
                        </TextListItem>
                        <TextListItem component={TextListItemVariants.dt}>
                            Compliance threshold
                        </TextListItem>
                        <TextListItem component={TextListItemVariants.dd}>
                            { fixedPercentage(complianceThreshold, 1) }
                        </TextListItem>
                        { businessObjective &&
                        <React.Fragment>
                            <TextListItem component={TextListItemVariants.dt}>
                                Business objective
                            </TextListItem>
                            <TextListItem component={TextListItemVariants.dd}>
                                { businessObjective.title }
                            </TextListItem>
                        </React.Fragment> }
                    </TextList>
                </TextContent>
            }
        >
            <Button variant="link" ouiaId="PopoverViewPolicyLink" isInline>
                <OutlinedQuestionCircleIcon className='grey-icon'/>
            </Button>
        </Popover>
    );
};

PolicyPopover.propTypes = {
    profile: propTypes.object,
    position: propTypes.string
};

export default PolicyPopover;
