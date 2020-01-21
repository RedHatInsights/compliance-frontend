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

