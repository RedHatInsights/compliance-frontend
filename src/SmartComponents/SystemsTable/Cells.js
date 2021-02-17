import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import { UnsupportedSSGVersion, ComplianceScore as Score } from 'PresentationalComponents';
import { profilesRulesPassed, profilesRulesFailed } from 'Utilities/ruleHelpers';

const SystemLink = ({ id, children }) => (
    <Link to={{ pathname: `/systems/${id}` }}>{ children }</Link>
);

SystemLink.propTypes = {
    id: propTypes.string,
    children: propTypes.node
};

/* eslint-disable camelcase */
export const Name = ({ id, name, osMajorVersion, osMinorVersion }) => {
    const hasOsInfo = (osMajorVersion, osMinorVersion) => (
        typeof(osMajorVersion) !== 'undefined' && typeof(osMinorVersion) !== 'undefined' &&
            osMajorVersion !== null && osMinorVersion !== null &&
            !(osMajorVersion === 0 && osMinorVersion === 0)
    );

    return <TextContent>
        <SystemLink { ...{ id } }>{ name }</SystemLink>

        {
            hasOsInfo(osMajorVersion, osMinorVersion) &&
                <Text component={TextVariants.small}>
                    RHEL {osMajorVersion}.{osMinorVersion}
                </Text>
        }

    </TextContent>;
};

Name.propTypes = {
    id: propTypes.string,
    name: propTypes.string,
    osMajorVersion: propTypes.string,
    osMinorVersion: propTypes.string
};
/* eslint-enable */

export const SSGVersion = ({ testResultProfiles, supported }) => {
    const { ssgVersion = 'Not available' } = testResultProfiles[0] || {};

    return supported ? ssgVersion :
        <UnsupportedSSGVersion messageVariant='singular'>
            { ssgVersion }
        </UnsupportedSSGVersion>;
};

SSGVersion.propTypes = {
    supported: propTypes.bool,
    ssgVersion: propTypes.string,
    testResultProfiles: propTypes.array
};

export const DetailsLink = ({ id, testResultProfiles = [] }) => (
    testResultProfiles.length > 0 && <SystemLink { ...{ id } }>
        View Report
    </SystemLink>
);

DetailsLink.propTypes = {
    id: propTypes.string,
    testResultProfiles: propTypes.array
};

export const Policies = ({ policies }) => (
    (policies || []).map((p) => (p.name)).join(', ')
);

export const FailedRules = ({ id, testResultProfiles }) => {
    const rulesFailed = profilesRulesFailed(testResultProfiles).length;
    return <SystemLink { ...{ id } }>
        { rulesFailed }
    </SystemLink>;
};

FailedRules.propTypes = {
    id: propTypes.string,
    testResultProfiles: propTypes.array
};

const NEVER = 'Never';

export const ComplianceScore = ({ testResultProfiles: profiles }) => {
    const scoreTotal = profiles.reduce((acc, profile) => acc + profile.score, 0);
    const rulesPassed = profilesRulesPassed(profiles).length;
    const rulesFailed = profilesRulesFailed(profiles).length;
    const numScored = profiles.reduce((acc, profile) => {
        if (profilesRulesPassed([profile]).length + profilesRulesFailed([profile]).length > 0) { return acc + 1; }

        return acc;
    }, 0);
    const score = numScored ? scoreTotal / numScored : 0;
    const compliant = profiles.every(profile => (
        profile.lastScanned === NEVER || profile.compliant === true
    ));
    const supported = (profiles || []).reduce((acc, profile) => acc && profile.supported, true);

    const scoreProps = {
        system: {
            score,
            rulesPassed,
            rulesFailed,
            compliant,
            supported
        }
    };
    console.log('PROP', scoreProps);
    return <Score { ...scoreProps } />;
};

ComplianceScore.propTypes = {
    testResultProfiles: propTypes.array
};

export const lastScanned = (profiles) => {
    const dates = profiles.map((profile) => new Date(profile.lastScanned));
    const last = new Date(Math.max.apply(null, dates.filter((date) => isFinite(date))));
    const result = (last instanceof Date && isFinite(last)) ? last : NEVER;

    return result;
};

export const LastScanned = ({ testResultProfiles: profiles }) => {
    const lastScannedDate = lastScanned(profiles);

    return (lastScannedDate instanceof Date) ?
        <DateFormat date={Date.parse(lastScannedDate)} type='relative' />
        : lastScannedDate;
};

LastScanned.propTypes = {
    testResultProfiles: propTypes.array
};
