import 'jest-canvas-mock';
import { configure, mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.mount = mount;
global.React = React;
global.toJson = toJson;
global.fetch = function () {};

global.renderJson = (component) => toJson(shallow(component));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  __esModule: true,
  default: () => ({
    updateDocumentTitle: jest.fn(),
    auth: {
      getUser: () =>
        Promise.resolve({
          identity: {
            account_number: '0',
            type: 'User',
            user: {
              is_org_admin: true,
            },
          },
          entitlements: {
            hybrid_cloud: { is_entitled: true },
            insights: { is_entitled: true },
            openshift: { is_entitled: true },
            smart_management: { is_entitled: false },
          },
        }),
    },
    appAction: jest.fn(),
    appObjectId: jest.fn(),
    on: jest.fn(),
    getUserPermissions: () => Promise.resolve(['inventory:*:*']),
    isBeta: jest.fn(),
    getApp: () => 'patch',
    getBundle: () => 'insights',
  }),
  useChrome: () => ({
    isBeta: jest.fn(),
  }),
}));

jest.mock(
  '@redhat-cloud-services/frontend-components-remediations/RemediationButton',
  () => ({
    __esModule: true,
    default: (props) => <button {...props} />,
  })
);

jest.mock('@redhat-cloud-services/frontend-components/Inventory', () => ({
  InventoryTable: (props) => <div {...props} />,
  DetailWrapper: (props) => <div {...props} />,
}));
