import React from 'react';
import propTypes from 'prop-types';
import { TabbedRules } from 'PresentationalComponents';

const EditPolicyRulesTab = ({ handleSelect, policy, selectedRuleRefIds }) => {
    return <TabbedRules
        profiles={ (policy?.policy?.profiles || []) }
        remediationsEnabled={ false }
        selectedFilter
        level={ 1 }
        handleSelect={ handleSelect }
        selectedRuleRefIds={ selectedRuleRefIds } />;
};

EditPolicyRulesTab.propTypes = {
    handleSelect: propTypes.func,
    policy: propTypes.object,
    selectedRuleRefIds: propTypes.array
};

export default EditPolicyRulesTab;
