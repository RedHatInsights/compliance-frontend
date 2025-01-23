import React from 'react';
import propTypes from 'prop-types';
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
import Details from './Details';
import {
  BreadcrumbLinkItem,
  StateViewWithError,
  StateViewPart,
} from 'PresentationalComponents';
import { InventoryDetails } from 'SmartComponents';
import { useTitleEntity } from 'Utilities/hooks/useDocumentTitle';
import useSystem from 'Utilities/hooks/api/useSystem';

const PageBreadcrumb = ({ systemName }) => (
  <Breadcrumb ouiaId="SystemDetailsPathBreadcrumb">
    <BreadcrumbLinkItem to="/">Compliance</BreadcrumbLinkItem>
    <BreadcrumbLinkItem to="/systems">Systems</BreadcrumbLinkItem>
    <BreadcrumbItem isActive>{systemName}</BreadcrumbItem>
  </Breadcrumb>
);

PageBreadcrumb.propTypes = {
  systemName: propTypes.string.isRequired,
};

const SystemDetails = ({ route }) => {
  const { inventoryId } = useParams();
  let {
    data: { data } = {},
    error,
    loading,
  } = useSystem({ params: [inventoryId] });
  const systemName = data?.display_name || inventoryId;

  useTitleEntity(route, systemName);

  return (
    <StateViewWithError stateValues={{ error, data, loading }}>
      <StateViewPart stateKey="data">
        <PageHeader>
          <PageBreadcrumb systemName={systemName} />
          <InventoryDetails inventoryId={inventoryId} />
        </PageHeader>
        <PageSection>
          <Details hidePassed inventoryId={inventoryId} system={data} />
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
  route: propTypes.object.isRequired,
};

export default SystemDetails;
