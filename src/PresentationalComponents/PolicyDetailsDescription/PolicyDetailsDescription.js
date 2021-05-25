import React from 'react';
import propTypes from 'prop-types';
import { fixedPercentage } from 'Utilities/TextHelper';
import {
    PolicyBusinessObjectiveTooltip,
    PolicyThresholdTooltip
} from 'PresentationalComponents';
import {
    Card,
    CardHeader,
    CardBody,
    TextContent,
    TextVariants,
    Text
} from '@patternfly/react-core';
import Truncate from '@redhat-cloud-services/frontend-components/Truncate';
import linkifyHtml from 'linkifyjs/html';

const PolicyDetailsDescription = ({ policy }) => (
    <Card>
        <CardHeader>
            <Text style={ { fontSize: 20 } }>
                <b>Policy details</b>
            </Text>
        </CardHeader>
        <CardBody>
            <TextContent>
                <Text component={TextVariants.h5}>
                    Compliance threshold
                    <PolicyThresholdTooltip />
                </Text>
                <Text className='threshold-tooltip' component={TextVariants.p}>
                    { fixedPercentage(policy.complianceThreshold, 1) }
                </Text>
                <Text component={TextVariants.h5}>
                    Business objective
                    <PolicyBusinessObjectiveTooltip />
                </Text>
                <Text component={TextVariants.p}>
                    { policy.businessObjective && policy.businessObjective.title || '-' }
                </Text>
                <Text component={TextVariants.h5}>Policy description</Text>
                <Text component={TextVariants.p}>
                    <Truncate text={linkifyHtml(policy.description || '')} length={380} inline={true} />
                </Text>
                <Text component={TextVariants.h5}>
                    Operating system
                </Text>
                <Text component={TextVariants.p}>
                    RHEL { policy.majorOsVersion }
                </Text>
                <Text component={TextVariants.h5}>Policy type </Text>
                <Text component={TextVariants.p}>{ policy.policyType }</Text>
                <Text component={TextVariants.h5}>Reference ID</Text>
                <Text component={TextVariants.p}>{ policy.refId }</Text>
            </TextContent>
        </CardBody>
    </Card>
);

PolicyDetailsDescription.propTypes = {
    policy: propTypes.object
};

export default PolicyDetailsDescription;
