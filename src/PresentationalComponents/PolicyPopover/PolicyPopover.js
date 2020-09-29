import React from 'react';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import {
    Button,
    Popover,
    TextList,
    TextListVariants,
    TextListItem,
    TextListItemVariants,
    TextContent
} from '@patternfly/react-core';
import { fixedPercentage } from 'Utilities/TextHelper';
import {
    Link
} from 'react-router-dom';
import propTypes from 'prop-types';

const PolicyPopover = ({ profile, position = 'top' }) => {
    const { name, policy, complianceThreshold, majorOsVersion, businessObjective } = profile;
    return (
        <Popover
            { ...{ position } }
            headerContent={name}
            footerContent={
                <Link to={'/scappolicies/' + policy.id} >
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
                            Policy SSG version
                        </TextListItem>
                        <TextListItem component={TextListItemVariants.dd}>
                            { policy && policy.benchmark && policy.benchmark.version }
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
            <Button variant="link" isInline>
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
