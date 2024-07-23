import React from 'react';
import TableStateProvider from '../components/TableStateProvider';

export const createTestWrapper = (Wrapper, props) => {
  return function CreatedWrapper({ children }) { // eslint-disable-line
    return <Wrapper {...props}>{children}</Wrapper>;
  };
};

export const DEFAULT_RENDER_OPTIONS = {
  wrapper: createTestWrapper(TableStateProvider),
};
