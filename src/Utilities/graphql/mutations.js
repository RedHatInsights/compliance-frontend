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
        }
    }
}
`;

export const UPDATE_PROFILE = gql`
mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
        profile {
            id,
            complianceThreshold,
            businessObjectiveId
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
