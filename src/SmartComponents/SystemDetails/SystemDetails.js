import React from 'react';
import propTypes from 'prop-types';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import Skeleton, {
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/Skeleton';

import {
  PageSection,
  Breadcrumb,
  BreadcrumbItem,
} from '@patternfly/react-core';
import Details from './ComplianceDetail';
import {
  BreadcrumbLinkItem,
  StateViewWithError,
  StateViewPart,
} from 'PresentationalComponents';
import { InventoryDetails } from 'SmartComponents';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';

const QUERY = gql`
  query SD_System($inventoryId: String!) {
    system(id: $inventoryId) {
      id
      name
    }
  }
`;

export const SystemDetails = ({ route }) => {
  const { inventoryId } = useParams();
  const { data, error, loading } = useQuery(QUERY, {
    variables: { inventoryId },
  });
  const systemName = data?.system?.name;

  useTitleEntity(route, systemName);

  return (
    <StateViewWithError stateValues={{ error, data, loading }}>
      <StateViewPart stateKey="data">
        <PageHeader>
          <Breadcrumb ouiaId="SystemDetailsPathBreadcrumb">
            <BreadcrumbLinkItem to="/">Compliance</BreadcrumbLinkItem>
            <BreadcrumbLinkItem to="/systems">Systems</BreadcrumbLinkItem>
            <BreadcrumbItem isActive>{systemName}</BreadcrumbItem>
          </Breadcrumb>
          <InventoryDetails inventoryId={inventoryId} />
        </PageHeader>
        <PageSection>
          <Details hidePassed inventoryId={inventoryId} />
        </PageSection>
      </StateViewPart>
      <StateViewPart stateKey="loading">
        <PageHeader>
          <Skeleton size={SkeletonSize.md} />
        </PageHeader>
      </StateViewPart>
    </StateViewWithError>
  );
};

SystemDetails.propTypes = {
  route: propTypes.object,
};

export default SystemDetails;
