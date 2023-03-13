import React from 'react';
import propTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core';
import MultiSegmentBar from '../MultiSegmentBar/MultiSegmentBar';
import { paletteColors, backgroundColors } from '../../constants';

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
      color: paletteColors.blue400,
      value: compliant,
      label: `Compliant: ${counts.compliant}`,
    },
    {
      name: 'Non-Compliant',
      color: paletteColors.blue200,
      value: counts.nonCompliant,
      label: `Non-Compliant: ${counts.nonCompliant}`,
    },
    {
      name: 'Unsupported',
      color: paletteColors.gold300,
      value: counts.unsupported,
      label: `Unsupported: ${counts.unsupported}`,
    },
    {
      name: 'Never reported',
      color: backgroundColors.light300,
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
