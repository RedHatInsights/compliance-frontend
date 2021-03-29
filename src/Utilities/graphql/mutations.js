import gql from 'graphql-tag';

export const CREATE_PROFILE = gql`
mutation CreateProfile($input: createProfileInput!) {
    createProfile(input: $input) {
        profile {
            id
        }
    }
}
`;

export const ASSOCIATE_SYSTEMS_TO_PROFILES = gql`
mutation associateSystems($input: associateSystemsInput!) {
    associateSystems(input: $input) {
        profile {
            id
            policy {
                profiles {
                    id
                    parentProfileId
                }
            }
        }
    }
}
`;

export const ASSOCIATE_PROFILES_TO_SYSTEM = gql`
mutation associateProfiles($input: associateProfilesInput!) {
    associateProfiles(input: $input) {
        system {
            id
            name
            profiles {
                id
                name
            }
        }
    }
}
`;

export const UPDATE_PROFILE = gql`
mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
        profile {
            id,
            name,
            complianceThreshold,
            businessObjectiveId,
            description
        }
    }
}
`;

export const CREATE_BUSINESS_OBJECTIVE = gql`
mutation createBusinessObjective($input: createBusinessObjectiveInput!) {
    createBusinessObjective(input: $input) {
        businessObjective {
            id
            title
        }
    }
}
`;

export const DELETE_PROFILE = gql`
mutation DeleteProfile($input: deleteProfileInput!) {
    deleteProfile(input: $input) {
        profile {
            id
        }
    }
}
`;

export const DELETE_REPORT = gql`
mutation DeleteReport($input: deleteTestResultsInput!) {
    deleteTestResults(input: $input) {
        profile {
            id
        }
    }
}
`;
