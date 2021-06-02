import React from 'react';
import propTypes from 'prop-types';
import { TextContent } from '@patternfly/react-core';
import { fitContent } from '@patternfly/react-table';
import { Link } from 'react-router-dom';
import { GreySmallText, SystemsCountWarning, OperatingSystemBadge } from 'PresentationalComponents';
import { renderComponent } from 'Utilities/helpers';

const PolicyNameCell = ({ id, policy, policyType }) => (
    <TextContent>
        <Link to={'/scappolicies/' + id}>{ policy.name }</Link>
        <GreySmallText>{ policyType }</GreySmallText>
    </TextContent>
);

PolicyNameCell.propTypes = {
    id: propTypes.string,
    policy: propTypes.object,
    policyType: propTypes.string
};

export const Name = {
    title: 'Name',
    sortByProp: 'name',
    renderFunc: renderComponent(PolicyNameCell)
};

export const OperatingSystem = {
    title: 'Operating system',
    transforms: [fitContent],
    sortByProp: 'majorOsVersion',
    renderFunc: (_data, _id, policy) => ( // eslint-disable-line
        <OperatingSystemBadge majorOsVersion={ policy.majorOsVersion } />
    )
};

export const Systems = {
    title: 'Systems',
    sortByProp: 'totalHostCount',
    renderFunc: (_data, _id, policy) => ( // eslint-disable-line
        policy.totalHostCount > 0 ? policy.totalHostCount :
            <SystemsCountWarning count={ policy.totalHostCount } variant='count' />
    )
};

export const BusinessObjective = {
    title: 'Business objective',
    transforms: [fitContent],
    sortByFunction: (policy) => (policy?.businessObjective?.title),
    renderFunc: (_data, _id, policy) => ( // eslint-disable-line
        policy.businessObjective && policy.businessObjective.title || '--'
    )
};

export const ComplianceThreshold = {
    title: 'Compliance threshold',
    transforms: [fitContent],
    sortByProp: 'complianceThreshold',
    renderFunc: (_data, _id, policy) => ( // eslint-disable-line
        `${policy.complianceThreshold}%`
    )
};
