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
  const { data, loading } = useReportTestResults({
    params: {
      reportId: policy.id,
      filter: `system_id=${inventoryId}`,
    },
  });

  return loading ? (
    <LoadingPolicyCards count={1} />
  ) : data.meta.total === 0 ? (
    <React.Fragment />
  ) : (
    <SystemPolicyCardPresentational
      policy={dataSerialiser({ ...data.data[0], ...policy }, dataMap)}
      style={{ height: '100%' }}
    />
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
    params: {
      systemId: inventoryId,
      limit: 100,
    },
  });

  return (
    <Grid hasGutter>
      {loading ? (
        <LoadingPolicyCards />
      ) : (
        (data?.data || []).map((policy) => (
          <GridItem sm={12} md={12} lg={6} xl={4} key={policy.id}>
            <SystemPolicyCard policy={policy} inventoryId={inventoryId} />
          </GridItem>
        ))
      )}
    </Grid>
  );
};
