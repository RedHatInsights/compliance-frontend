import React from 'react';
import { GridItem, Card, CardBody } from '@patternfly/react-core';
import { Instagram } from 'react-content-loader';

const LoadingPolicyCards = () =>
  [...Array(3)].map((_item, i) => (
    <GridItem span={4} key={i}>
      <Card>
        <CardBody>
          <Instagram />
        </CardBody>
      </Card>
    </GridItem>
  ));

export default LoadingPolicyCards;
