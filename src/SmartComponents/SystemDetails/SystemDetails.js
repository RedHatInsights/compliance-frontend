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
  Bullseye,
  Spinner,
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
import useAPIV2FeatureFlag from 'Utilities/hooks/useAPIV2FeatureFlag';

const QUERY = gql`
  query SD_System($inventoryId: String!) {
    system(id: $inventoryId) {
      id
      name
    }
  }
`;

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

const SystemDetailBase = ({
  data,
  error,
  loading,
  systemName,
  inventoryId,
}) => (
  <StateViewWithError stateValues={{ error, data, loading }}>
    <StateViewPart stateKey="data">
      <PageHeader>
        <PageBreadcrumb systemName={systemName} />
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

SystemDetailBase.propTypes = {
  data: propTypes.object,
  error: propTypes.object,
  loading: propTypes.bool,
  systemName: propTypes.string,
  inventoryId: propTypes.string,
};

const SystemDetailsGraphQL = ({ route }) => {
  const { inventoryId } = useParams();
  const { data, error, loading } = useQuery(QUERY, {
    variables: { inventoryId },
  });
  const systemName = data?.system?.name;

  useTitleEntity(route, systemName);

  return (
    <SystemDetailBase {...{ data, error, loading, systemName, inventoryId }} />
  );
};

SystemDetailsGraphQL.propTypes = {
  route: propTypes.object.isRequired,
};

const SystemDetailsRest = ({ route }) => {
  const { inventoryId } = useParams();
  let { data: { data } = {}, error, loading } = useSystem(inventoryId);
  const systemName = data?.display_name || inventoryId;

  useTitleEntity(route, systemName);

  return (
    <SystemDetailBase {...{ data, error, loading, systemName, inventoryId }} />
  );
};

SystemDetailsRest.propTypes = {
  route: propTypes.object.isRequired,
};

export const SystemDetails = (props) => {
  const restApiEnabled = useAPIV2FeatureFlag();
  const Component =
    restApiEnabled === undefined ? (
      <Bullseye>
        <Spinner />
      </Bullseye>
    ) : restApiEnabled === true ? (
      SystemDetailsRest
    ) : (
      SystemDetailsGraphQL
    );

  return <Component {...props} />;
};

export default SystemDetails;
