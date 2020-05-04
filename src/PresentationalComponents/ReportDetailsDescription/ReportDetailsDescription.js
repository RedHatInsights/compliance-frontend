import React from 'react';
import { fixedPercentage } from 'Utilities/TextHelper';
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

const ReportDetailsDescription = ({ profile }) => (
    <TextContent className='policy-details'>
        { !profile.policy ? <React.Fragment>
            <Text component={TextVariants.h2}>Policy details</Text><br/>
            <Text component={TextVariants.p}>Policy not managed in cloud.redhat.com</Text>
            <Text component={TextVariants.p}>
                <a target='_blank' rel='noopener noreferrer'
                    href='https://access.redhat.com/products/cloud_management_services_for_rhel'>
                    Learn to manage your policies in cloud.redhat.com
                </a>
            </Text>
        </React.Fragment>
            : <TextList component={TextListVariants.dl}>
                <TextListItem component={TextListItemVariants.dt}>
                    <Text component={TextVariants.h2}>Policy details</Text>
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                    <Link to={'/scappolicies/' + profile.policy.id} >
                        View policy
                    </Link>
                </TextListItem>
                <TextListItem component={TextListItemVariants.dt}>
                    Operating system
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                    RHEL { profile.majorOsVersion } (SSG { profile.benchmark.version })
                </TextListItem>
                <TextListItem component={TextListItemVariants.dt}>
                    Compliance threshold
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                    { fixedPercentage(profile.complianceThreshold, 1) }
                </TextListItem>
                <TextListItem component={TextListItemVariants.dt}>
                    Business objective
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                    { profile.businessObjective ? profile.businessObjective.title : '--' }
                </TextListItem>
            </TextList>
        }
    </TextContent>
);

ReportDetailsDescription.propTypes = {
    profile: propTypes.shape({
        id: propTypes.string,
        complianceThreshold: propTypes.number,
        businessObjective: propTypes.object,
        majorOsVersion: propTypes.string,
        policy: propTypes.shape({
            id: propTypes.string
        }),
        benchmark: propTypes.shape({
            version: propTypes.string
        })
    })
};

export default ReportDetailsDescription;
