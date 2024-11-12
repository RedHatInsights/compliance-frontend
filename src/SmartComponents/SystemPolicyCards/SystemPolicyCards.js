// with REST API implementation
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core';
import useReportTestResults from 'Utilities/hooks/api/useReportTestResults';
import SystemPolicyCardPresentational from 'PresentationalComponents/SystemPolicyCard';
import LoadingPolicyCards from 'PresentationalComponents/SystemPolicyCards/components/LoadingPolicyCards';
import dataSerialiser from 'Utilities/dataSerialiser';
import { dataMap } from './constants';
import useSystemReports from 'Utilities/hooks/api/useSystemReports';
import { useParams } from 'react-router-dom';

const SystemPolicyCard = ({ policy }) => {
  const { inventoryId } = useParams();
  const { data } = useReportTestResults({
    params: [
      policy.id,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      `system_id=${inventoryId}`,
    ],
  });

  return (
    data?.meta.total === 0 || (
      <GridItem sm={12} md={12} lg={6} xl={4}>
        {data === undefined ? (
          <LoadingPolicyCards count={1} />
        ) : (
          <SystemPolicyCardPresentational
            policy={dataSerialiser({ ...data.data[0], ...policy }, dataMap)}
            style={{ height: '100%' }}
          />
        )}
      </GridItem>
    )
  );
};

SystemPolicyCard.propTypes = {
  policy: PropTypes.shape({
    id: PropTypes.string.isRequired,
    profile_title: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export const SystemPolicyCards = () => {
  const { inventoryId } = useParams();
  const { data, loading } = useSystemReports({
    params: [inventoryId, null, 100],
  });

  return (
    <Grid hasGutter>
      {loading ? (
        <LoadingPolicyCards />
      ) : (
        (data?.data || []).map((policy) => {
          return (
            <SystemPolicyCard
              policy={policy}
              inventoryId={inventoryId}
              key={policy.id}
            />
          );
        })
      )}
    </Grid>
  );
};
