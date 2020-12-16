import React from 'react';
import propTypes from 'prop-types';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { fixedPercentage } from 'Utilities/TextHelper';
import {
    Card,
    CardHeader,
    CardBody,
    TextContent,
    TextVariants,
    Text,
    Tooltip
} from '@patternfly/react-core';
import { Truncate } from '@redhat-cloud-services/frontend-components';
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
                    <Tooltip
                        position='right'
                        content={
                            <span>
                                The threshold for compliance is a value set by your organization for
                                each policy.
                                This defines the percentage of passed rules that must be met in order
                                for a system to be determined &quot;compliant&quot;.
                            </span>
                        }
                    >
                        <span>
                            &nbsp;<OutlinedQuestionCircleIcon className='grey-icon'/>
                        </span>
                    </Tooltip>
                </Text>
                <Text className='threshold-tooltip' component={TextVariants.p}>
                    { fixedPercentage(policy.complianceThreshold, 1) }
                </Text>
                <Text component={TextVariants.h5}>Business objective</Text>
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
