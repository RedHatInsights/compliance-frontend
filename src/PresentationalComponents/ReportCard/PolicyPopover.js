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

const PolicyPopover = ({ policy }) => {
    const { name, external, id, complianceThreshold, majorOsVersion, businessObjective } = policy;
    const footerContent = external ? 'External policy' :
        <Link to={'/scappolicies/' + id} >
            View policy
        </Link>;
    return (
        <Popover
            headerContent={name}
            footerContent={footerContent}
            bodyContent={
                <TextContent className='policy-details'>
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
                </TextContent>
            }
        >
            <OutlinedQuestionCircleIcon className='grey-icon'/>
        </Popover>
    );
};

PolicyPopover.propTypes = {
    policy: propTypes.object
};

export default PolicyPopover;
