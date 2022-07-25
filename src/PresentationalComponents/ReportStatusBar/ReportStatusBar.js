import React from 'react';
import propTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core';
import {
  global_BackgroundColor_light_300,
  global_palette_blue_200,
  global_palette_blue_400,
  global_palette_gold_300,
} from '@patternfly/react-tokens';
import MultiSegmentBar from '../MultiSegmentBar/MultiSegmentBar';

const ReportStatusBar = ({
  hostCounts: { compliant, totalResults, unsupported, total },
}) => {
  const counts = {
    compliant: compliant,
    nonCompliant: totalResults - compliant,
    unsupported: unsupported,
    neverReported: total - totalResults - unsupported,
  };

  const data = [
    {
      name: 'Compliant',
      color: global_palette_blue_400.var,
      value: compliant,
      label: `Compliant: ${counts.compliant}`,
    },
    {
      name: 'Non-Compliant',
      color: global_palette_blue_200.var,
      value: counts.nonCompliant,
      label: `Non-Compliant: ${counts.nonCompliant}`,
    },
    {
      name: 'Unsupported',
      color: global_palette_gold_300.var,
      value: counts.unsupported,
      label: `Unsupported: ${counts.unsupported}`,
    },
    {
      name: 'Never reported',
      color: global_BackgroundColor_light_300.var,
      value: counts.neverReported,
      label: `Never reported: ${counts.neverReported}`,
    },
  ];

  const compliancePercentage = totalResults
    ? (counts.compliant * 100) / totalResults
    : 0;

  return (
    <Grid hasGutter>
      <GridItem span={9}>
        <MultiSegmentBar data={data} />
      </GridItem>
      <GridItem span={3}>
        <span>{`${Math.round(compliancePercentage)}%`}</span>
      </GridItem>
    </Grid>
  );
};

ReportStatusBar.propTypes = {
  hostCounts: propTypes.exact({
    totalResults: propTypes.number,
    compliant: propTypes.number,
    unsupported: propTypes.number,
    total: propTypes.number,
  }),
};

export default ReportStatusBar;
