import React from 'react';
import propTypes from 'prop-types';
import { Label, TextContent, Text, Progress } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { PolicyPopover, GreySmallText, SSGVersionWarning } from 'PresentationalComponents';

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
    profile: propTypes.object
};

export const OperatingSystem = ({ majorOsVersion, ssgVersion, supported }) => {
    const rhelColorMap = {
        7: 'cyan',
        8: 'purple',
        default: 'var(--pf-global--disabled-color--200)'
    };
    const color = rhelColorMap[majorOsVersion] || rhelColorMap.default;

    return <React.Fragment>
        <Label { ...{ color } }>RHEL { majorOsVersion }</Label>
        { ssgVersion && <Text>
            <GreySmallText>
                <SSGVersionWarning supported={ supported }>{ ssgVersion }</SSGVersionWarning>
            </GreySmallText>
        </Text> }
    </React.Fragment>;
};

OperatingSystem.propTypes = {
    majorOsVersion: propTypes.string,
    ssgVersion: propTypes.string,
    supported: propTypes.bool
};

export const CompliantSystems = ({ totalHostCount = 0, compliantHostCount = 0, unsupportedSystems = 0 }) => {
    const tooltipText = 'Insights cannot provide a compliance score for systems running an unsupported ' +
        'version of the SSG at the time this report was created, as the SSG version was not supported by RHEL.';

    return <React.Fragment>
        <Progress
            measureLocation={ 'outside' }
            value={ (100 / totalHostCount) * compliantHostCount } />
        <GreySmallText>
            { `${ compliantHostCount } of ${ totalHostCount } systems ` }

            { unsupportedSystems > 0 && <SSGVersionWarning
                supported={ false }
                tooltipText={ tooltipText }
                style={ { marginLeft: '.5em' } }>
                <strong className='ins-u-warning'>{ unsupportedSystems } unsupported</strong>
            </SSGVersionWarning> }
        </GreySmallText>
    </React.Fragment>;
};

CompliantSystems.propTypes = {
    totalHostCount: propTypes.number,
    compliantHostCount: propTypes.number,
    unsupportedSystems: propTypes.number
};
