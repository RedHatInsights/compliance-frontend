import React from 'react';
import mockChrome from './mockChrome';

global.React = React;
global.fetch = jest.fn();

global.insights = {
  chrome: mockChrome,
};

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  __esModule: true,
  default: () => mockChrome,
  useChrome: () => mockChrome,
}));

jest.mock(
  '@redhat-cloud-services/frontend-components-remediations/RemediationButton',
  () => ({
    __esModule: true,
    default: (props) => <button aria-label="Remediation Button" {...props} />,
  })
);
const ignoredAttributes = ['onLoad', 'getEntities'];
const convertValue = (key, value) => {
  if (ignoredAttributes.includes(key)) {
    return '[Ignored attribute]';
  }

  return (typeof value !== 'function' && value?.toString?.()) || value;
};

const lowercasePropNames = (props) =>
  Object.fromEntries(
    Object.entries(props).reduce((entries, [key, value]) => {
      return !ignoredAttributes.includes(key)
        ? [...entries, [key.toLowerCase(), convertValue(key, value)]]
        : entries;
    }, [])
  );

jest.mock('@redhat-cloud-services/frontend-components/Inventory', () => ({
  InventoryTable: global.React.forwardRef(({ children, ...props }, ref) => (
    <div
      ref={{ ...ref, onRefreshData: () => ({}) }}
      aria-label="Inventory Table"
      {...lowercasePropNames(props)}
    >
      {children}
    </div>
  )),
  DetailWrapper: global.React.forwardRef(({ children, ...props }, ref) => (
    <div
      ref={ref}
      aria-label="Inventory Details Wrapper"
      {...lowercasePropNames(props)}
    >
      {children}
    </div>
  )),
  InventoryDetailHead: global.React.forwardRef(
    ({ children, ...props }, ref) => (
      <div
        ref={ref}
        aria-label="Inventory Detail Head"
        {...lowercasePropNames(props)}
      >
        {children}
      </div>
    )
  ),
}));
