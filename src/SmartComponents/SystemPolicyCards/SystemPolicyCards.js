import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import SystemPolicyCardPresentational from 'PresentationalComponents/SystemPolicyCard';
import propTypes from 'prop-types';

export const SystemPolicyCards = ({
  reportTestResults,
  selectedPolicy,
  onSelectPolicy,
}) => (
  <Grid hasGutter>
    {reportTestResults.map((testResult) => {
      const isClicked = selectedPolicy === testResult.report_id;
      return (
        <GridItem sm={12} md={12} lg={6} xl={4} key={testResult.report_id}>
          <SystemPolicyCardPresentational
            policy={testResult}
            isClickable
            isClicked={isClicked}
            onClickAction={() =>
              onSelectPolicy && onSelectPolicy(testResult.report_id)
            }
            selectableActionAriaLabel={`Select ${testResult.title}`}
          />
        </GridItem>
      );
    })}
  </Grid>
);

SystemPolicyCards.propTypes = {
  reportTestResults: propTypes.array.isRequired,
  selectedPolicy: propTypes.string,
  onSelectPolicy: propTypes.func,
};

export default SystemPolicyCards;
