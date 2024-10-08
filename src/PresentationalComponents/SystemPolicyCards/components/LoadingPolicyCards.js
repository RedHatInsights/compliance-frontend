import React from 'react';
import { GridItem, Card, CardBody } from '@patternfly/react-core';
import { List } from 'react-content-loader';
import propTypes from 'prop-types';

const LoadingPolicyCards = ({ count = 3 }) =>
  [...Array(count)].map((_item, i) => (
    <GridItem sm={12} md={12} lg={6} xl={4} key={i}>
      <Card aria-label="Loading policy" role="progressbar">
        <CardBody>
          <List />
        </CardBody>
      </Card>
    </GridItem>
  ));

LoadingPolicyCards.propTypes = {
  count: propTypes.number,
};

export default LoadingPolicyCards;
