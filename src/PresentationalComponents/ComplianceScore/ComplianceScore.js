import React from 'react';
import propTypes from 'prop-types';
import {
    QuestionCircleIcon,
    CheckCircleIcon,
    ExclamationCircleIcon
} from '@patternfly/react-icons';
import { Tooltip } from '@patternfly/react-core';
import { fixedPercentage } from 'Utilities/TextHelper';

const CompliantIcon = (system) => {
    if ((system.rulesPassed + system.rulesFailed) === 0) {
        return <QuestionCircleIcon style={{ color: 'var(--pf-global--disabled-color--100)' }}/>;
    } else {
        return system.compliant ?
            <CheckCircleIcon style={{ color: 'var(--pf-global--success-color--200)' }}/> :
            <ExclamationCircleIcon style={{ color: 'var(--pf-global--danger-color--100)' }}/>;
    }
};

export const complianceScoreString = (system) => {
    if (system.supported === false) {
        return ' Unsupported';
    } else if ((system.rulesPassed + system.rulesFailed) === 0) {
        return ' N/A';
    }

    return ' ' + fixedPercentage(system.score);
};

const ComplianceScore = ({ system }) => (
    <React.Fragment>
        { system.supported ?
            <Tooltip content={
                'The system compliance score is calculated by OpenSCAP and ' +
                'is a normalized weighted sum of rules selected for this policy.'
            }>
                <CompliantIcon key={ `system-compliance-icon-${system.id}` } { ...system } />
                { complianceScoreString(system) }
            </Tooltip>
            :
            complianceScoreString(system) }
    </React.Fragment>
);

ComplianceScore.propTypes = {
    system: propTypes.object
};

export default ComplianceScore;
