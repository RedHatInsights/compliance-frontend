import React from 'react';
import { gql } from '@apollo/client';
import {
  LinkButton,
  LinkWithPermission as Link,
} from '../../PresentationalComponents';

export const QUERY = gql`
  {
    profiles(search: "external = false and canonical = false") {
      edges {
        node {
          id
          name
          description
          refId
          complianceThreshold
          totalHostCount
          osMajorVersion
          policyType
          policy {
            id
            name
          }
          businessObjective {
            id
            title
          }
        }
      }
    }
  }
`;

export const dataMap = {
  id: ['id', 'policy.id'],
  title: ['name', 'policy.name'],
  description: 'description',
  business_objective: 'businessObjective.title',
  compliance_threshold: 'complianceThreshold',
  total_system_count: 'totalHostCount',
  os_major_version: 'osMajorVersion',
  profile_title: 'policyType',
  ref_id: 'refId',
};

export const CreateLink = () => (
  <Link
    to="/scappolicies/new"
    Component={LinkButton}
    componentProps={{
      variant: 'primary',
      ouiaId: 'CreateNewPolicyButton',
    }}
  >
    Create new policy
  </Link>
);
