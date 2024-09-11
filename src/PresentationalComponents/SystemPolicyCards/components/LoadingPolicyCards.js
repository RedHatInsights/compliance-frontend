import React from 'react';
import { GridItem, Card, CardBody } from '@patternfly/react-core';
import { Instagram } from 'react-content-loader';

export const LoadingPolicyCard = () => (
  <div aria-label="Loading policy" role="progressbar">
    <GridItem span={4}>
      <Card>
        <CardBody>
          <Instagram />
        </CardBody>
      </Card>
    </GridItem>
  </div>
);

const LoadingPolicyCards = () => (
  <div aria-label="Loading policies" role="progressbar">
    {[...Array(3)].map((_item, i) => (
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
export default LoadingPolicyCards;
