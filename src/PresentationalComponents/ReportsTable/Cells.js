import React from 'react';
import propTypes from 'prop-types';
import { Label, TextContent, Progress } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { PolicyPopover, GreySmallText } from 'PresentationalComponents';

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

export const CompliantSystems = ({ testResultHostCount = 0, compliantHostCount = 0 }) => (
    <React.Fragment>
        <Progress
            measureLocation={ 'outside' }
            value={ (100 / testResultHostCount) * compliantHostCount } />
        <GreySmallText>{ `${ compliantHostCount } of ${ testResultHostCount } systems` }</GreySmallText>
    </React.Fragment>
);

CompliantSystems.propTypes = {
    testResultHostCount: propTypes.number,
    compliantHostCount: propTypes.number
};
