import React from 'react';
import propTypes from 'prop-types';
import { Spinner, Bullseye } from '@patternfly/react-core';
import useAPIV2FeatureFlag from '@/Utilities/hooks/useAPIV2FeatureFlag';

export const GatedComponents = ({ RestComponent, GraphQLComponent }) => {
  const isRestApiEnabled = useAPIV2FeatureFlag();

  return (
    <>
      {isRestApiEnabled === undefined ? (
        <Bullseye>
          <Spinner />
        </Bullseye>
      ) : isRestApiEnabled ? (
        <RestComponent />
      ) : (
        <GraphQLComponent />
      )}
    </>
  );
};

GatedComponents.propTypes = {
  RestComponent: propTypes.element.isRequired,
  GraphQLComponent: propTypes.element.isRequired,
};

export default GatedComponents;
