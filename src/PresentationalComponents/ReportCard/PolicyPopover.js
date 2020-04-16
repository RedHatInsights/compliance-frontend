import React from 'react';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import {
    Popover,
    TextListItem,
    TextListItemVariants,
    TextContent
} from '@patternfly/react-core';
import { fixedPercentage } from '../../Utilities/TextHelper';
import {
    Link
} from 'react-router-dom';
import propTypes from 'prop-types';

const PolicyPopover = ({ profile }) => {
    const { name, policy, complianceThreshold, majorOsVersion, businessObjective } = profile;
    return (
        <Popover
            headerContent={name}
            footerContent={
                <Link to={'/scappolicies/' + policy.id} >
                    View policy
                </Link>
            }
            bodyContent={
                <TextContent className='policy-details'>
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
                </TextContent>
            }
        >
            <OutlinedQuestionCircleIcon className='grey-icon'/>
        </Popover>
    );
};

PolicyPopover.propTypes = {
    profile: propTypes.object
};

export default PolicyPopover;
