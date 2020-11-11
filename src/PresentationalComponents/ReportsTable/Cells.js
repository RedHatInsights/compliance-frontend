import React from 'react';
import propTypes from 'prop-types';
import { Label, Text, TextContent, TextVariants, Progress } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { PolicyPopover } from 'PresentationalComponents';

export const GreySmallText = ({ children }) => (
    <Text
        style={{ color: 'var(--pf-global--Color--200)' }}
        component={ TextVariants.small }>{ children }</Text>
);

GreySmallText.propTypes = {
    children: propTypes.node
};

export const Name = (profile) => (
    <TextContent>
        <Link to={'/reports/' + profile.id} style={ { marginRight: '.5rem' }}>
            { profile.policy ? profile.policy.name : profile.name }
        </Link>
        { profile.policy
            ? <React.Fragment>
                <PolicyPopover { ...{ profile, position: 'right' } } />
                <GreySmallText>{ profile.policyType }</GreySmallText>
            </React.Fragment>

            : <Label color="red">External</Label>
        }
    </TextContent>
);

Name.propTypes = {
    id: propTypes.string,
    name: propTypes.string,
    policy: propTypes.object
};

export const rhelColorMap = {
    7: 'cyan',
    8: 'purple'
};
export const OperatingSystem = ({ majorOsVersion }) => (
    <Label color={ rhelColorMap[majorOsVersion] }>RHEL { majorOsVersion }</Label>
);

OperatingSystem.propTypes = {
    majorOsVersion: propTypes.string
};

export const CompliantSystems = ({ totalHostCount = 0, compliantHostCount = 0 }) => (
    <React.Fragment>
        <Progress
            measureLocation={ 'outside' }
            value={ (100 / totalHostCount) * compliantHostCount } />
        <GreySmallText>{ `${ compliantHostCount } of ${ totalHostCount } systems` }</GreySmallText>
    </React.Fragment>
);

CompliantSystems.propTypes = {
    totalHostCount: propTypes.number,
    compliantHostCount: propTypes.number
};
