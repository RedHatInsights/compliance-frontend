import React from 'react';
import propTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { Bullseye, Spinner } from '@patternfly/react-core';
import {
  ComplianceEmptyState,
  StateViewWithError,
  StateViewPart,
} from 'PresentationalComponents';
import '../compliance.scss';
import { QUERY } from '../constants';
import Details from './Details';

export const ComplianceDetails = ({
  hidePassed,
  onLoaded,
  inventoryId,
  ...props
}) => {
  const { data, error, loading } = useQuery(QUERY, {
    variables: { systemId: inventoryId },
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      onLoaded?.(data.system?.name);
    },
  });

  return (
    <div className="ins-c-compliance__scope">
      <StateViewWithError stateValues={{ error, data, loading }}>
        <StateViewPart stateKey="loading">
          <Bullseye>
            <Spinner />
          </Bullseye>
        </StateViewPart>
        <StateViewPart stateKey="data">
          {data?.system ? (
            <Details {...props} hidePassed={hidePassed} system={data.system} />
          ) : (
            <ComplianceEmptyState title="No policies are reporting for this system" />
          )}
        </StateViewPart>
      </StateViewWithError>
    </div>
  );
};

ComplianceDetails.propTypes = {
  inventoryId: propTypes.string,
  hidePassed: propTypes.bool,
  onLoaded: propTypes.func,
};

export default ComplianceDetails;
