import React from 'react';
import { GridItem, Card, CardBody } from '@patternfly/react-core';
import { Instagram } from 'react-content-loader';
import propTypes from 'prop-types';

const LoadingPolicyCards = ({ count = 3 }) => (
  <div aria-label="Loading policies" role="progressbar">
    {[...Array(count)].map((_item, i) => (
      <GridItem span={4} key={i}>
        <Card>
          <CardBody>
            <Instagram />
          </CardBody>
        </Card>
      </GridItem>
    ))}
  </div>
);

LoadingPolicyCards.propTypes = {
  count: propTypes.number,
};

export default LoadingPolicyCards;
