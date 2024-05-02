import { gql } from '@apollo/client';

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
          id
          profiles {
            id
            parentProfileId
            osMinorVersion
            benchmark {
              valueDefinitions {
                defaultValue
                description
                id
                refId
                title
                valueType
              }
            }
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

export const ASSOCIATE_RULES_TO_PROFILE = gql`
  mutation associateRules($input: associateRulesInput!) {
    associateRules(input: $input) {
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
        id
        name
        complianceThreshold
        businessObjectiveId
        description
        values
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
