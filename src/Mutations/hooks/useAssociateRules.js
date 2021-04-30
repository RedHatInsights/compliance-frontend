import { useMutation } from '@apollo/client';
import { ASSOCIATE_RULES_TO_PROFILE } from '../graphql/mutations';

const useAssociateRules = () => {
    const [associateRules] = useMutation(ASSOCIATE_RULES_TO_PROFILE);

    return async ({ id, ruleRefIds }, profiles) => {
        const profile = profiles.find((profile) => (
            profile.id === id || profile.parentProfileId === id
        ));
        const ruleInput = {
            id: profile?.id,
            ruleRefIds
        };

        const { error } = await associateRules({ variables: { input: ruleInput } });
        if (error) { throw error; }
    };
};

export default useAssociateRules;
