import React from 'react';
import { fixedPercentage } from '../../Utilities/TextHelper';
import propTypes from 'prop-types';
import {
    Text,
    TextContent,
    TextList,
    TextListVariants,
    TextListItem,
    TextListItemVariants,
    TextVariants
} from '@patternfly/react-core';
import {
    Link
} from 'react-router-dom';

const ReportDetailsDescription = ({ policy }) => (
    <TextContent className='policy-details'>
        { policy.external ? <React.Fragment>
            <Text component={TextVariants.h2}>Policy details</Text><br/>
            <Text component={TextVariants.p}>Policy not managed in cloud.redhat.com</Text>
            <Text component={TextVariants.p}>
                <Link to='https://access.redhat.com/products/cloud_management_services_for_rhel'>
                    Learn to manage your policies in cloud.redhat.com
                </Link>
            </Text>
        </React.Fragment>
            : <TextList component={TextListVariants.dl}>
                <TextListItem component={TextListItemVariants.dt}>
                    <Text component={TextVariants.h2}>Policy details</Text>
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                    <Link to={'/scappolicies/' + policy.id} >
                        View policy
                    </Link>
                </TextListItem>
                <TextListItem component={TextListItemVariants.dt}>
                    Operating system
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                    RHEL { policy.majorOsVersion } (SSG { policy.benchmark.version })
                </TextListItem>
                <TextListItem component={TextListItemVariants.dt}>
                    Compliance threshold
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                    { fixedPercentage(policy.complianceThreshold, 1) }
                </TextListItem>
                { policy.businessObjective &&
                <React.Fragment>
                    <TextListItem component={TextListItemVariants.dt}>
                        Business objective
                    </TextListItem>
                    <TextListItem component={TextListItemVariants.dd}>
                        { policy.businessObjective.title }
                    </TextListItem>
                </React.Fragment>
                }
            </TextList>
        }
    </TextContent>
);

ReportDetailsDescription.propTypes = {
    policy: propTypes.shape({
        id: propTypes.string,
        complianceThreshold: propTypes.number,
        businessObjective: propTypes.object,
        majorOsVersion: propTypes.number,
        external: propTypes.bool,
        benchmark: propTypes.shape({
            version: propTypes.string
        })
    })
};

export default ReportDetailsDescription;
