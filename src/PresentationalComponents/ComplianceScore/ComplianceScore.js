import React from 'react';
import {
    QuestionCircleIcon,
    CheckCircleIcon,
    ExclamationCircleIcon
} from '@patternfly/react-icons';
import { fixedPercentage } from '../../Utilities/TextHelper';

const CompliantIcon = (system) => (
    <React.Fragment>
        {
            ((system.rulesPassed + system.rulesFailed) === 0) ?
                <QuestionCircleIcon style={{ color: 'var(--pf-global--disabled-color--100)' }}/> :
                system.compliant ?
                    <CheckCircleIcon style={{ color: 'var(--pf-global--success-color--100)' }}/> :
                    <ExclamationCircleIcon style={{ color: 'var(--pf-global--danger-color--100)' }}/>
        }
    </React.Fragment>
);

export const complianceScoreString = (system) => {
    if ((system.rulesPassed + system.rulesFailed) === 0) {
        return ' N/A';
    }

    return ' ' + fixedPercentage(system.score);
};

const ComplianceScore = (system) => (
    <React.Fragment>
        <CompliantIcon key={ `system-compliance-icon-${system.id}` } { ...system } />
        { complianceScoreString(system) }
    </React.Fragment>
);

export default ComplianceScore;
