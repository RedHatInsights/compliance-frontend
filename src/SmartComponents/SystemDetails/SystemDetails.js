import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import Main from '@redhat-cloud-services/frontend-components/Main';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { BreadcrumbLinkItem } from 'PresentationalComponents';
import { defaultTitleSuffixed } from 'Utilities/hooks/useDocumentTitle';
import ComplianceDetails from './components/ComplianceDetails';
import InventoryDetails from './components/InventoryDetails';

export const SystemDetails = ({ route }) => {
  const { inventoryId } = useParams();

  const [systemName, setSystemName] = useState();

  const onLoadedDetails = (loadedSystemName) => {
    setSystemName(loadedSystemName);
  };

  useEffect(() => {
    document.title = defaultTitleSuffixed(
      route.title.replace('$entityTitle', systemName)
    );
  }, [systemName]);

  return (
    <>
      <PageHeader>
        <Breadcrumb ouiaId="SystemDetailsPathBreadcrumb">
          <BreadcrumbLinkItem to="/">Compliance</BreadcrumbLinkItem>
          <BreadcrumbLinkItem to="/systems">Systems</BreadcrumbLinkItem>
          <BreadcrumbItem isActive>{systemName}</BreadcrumbItem>
        </Breadcrumb>
        <InventoryDetails />
      </PageHeader>
      <Main>
        <ComplianceDetails
          inventoryId={inventoryId}
          hidePassed
          onLoaded={onLoadedDetails}
        />
      </Main>
    </>
  );
};

SystemDetails.propTypes = {
  route: propTypes.object,
};

export default SystemDetails;
