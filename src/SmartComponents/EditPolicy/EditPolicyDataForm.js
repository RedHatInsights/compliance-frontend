import React from 'react';
import propTypes from 'prop-types';
import { FormRenderer } from 'PresentationalComponents';
import { mapCountOsMinorVersions } from 'Store/Reducers/SystemStore';
import { default as formSchema, componentMapper } from './schema';

const profilesToOsMinorMap = (profiles, hosts) => (
    (profiles || []).reduce((acc, profile) => {
        if (profile.osMinorVersion !== '') {
            acc[profile.osMinorVersion] ||= { osMinorVersion: profile.osMinorVersion, count: 0 };
        }

        return acc;
    }, mapCountOsMinorVersions(hosts || []))
);

export const EditPolicyForm = ({ policy }) => {
    const policyProfiles = policy?.policy?.profiles || [];
    const osMinorVersionCounts = profilesToOsMinorMap(policyProfiles, policy.hosts);

    // Using JSON in a string datatype may not be ideal
    // look into either being able to define a custom data type or solve with other more fitting type
    const initialRuleSelection = JSON.stringify(policyProfiles.map((policyProfile) => ({
        id: policyProfile.id,
        ruleRefIds: policyProfile.rules.map((rule) => (rule.refId)),
        count: osMinorVersionCounts[policyProfile.osMinorVersion]
    })));
    const initialSystemsSeletion = JSON.stringify(policy?.hosts);

    const schema = formSchema(policy, {
        initialRuleSelection,
        initialSystemsSeletion,
        ruleFieldProps: {
            osMinorVersionCounts,
            policy
        }
    });

    const onSubmit = (...args) => {
        console.log(...args);
    };

    const onCancel = (...args) => {
        console.log(...args);
    };

    return <FormRenderer { ...{
        componentMapper,
        schema,
        onSubmit,
        onCancel
    } } />;
};

EditPolicyForm.propTypes = {
    policy: propTypes.object,
    updatedPolicy: propTypes.object,
    setUpdatedPolicy: propTypes.func
};

export default EditPolicyForm;
