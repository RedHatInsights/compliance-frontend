import 'jest-canvas-mock';
import { configure, mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import 'babel-polyfill';

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.mount = mount;
global.React = React;
global.toJson = toJson;
global.fetch = function () {};

global.renderJson = (component) => toJson(shallow(component));
global.window.__scalprum__ = {
  scalprumOptions: {
    cacheTimeout: 999999,
  },
  appsConfig: {
    inventory: {
      manifestLocation:
        'https://console.stage.redhat.com/apps/inventory/fed-mods.json',
      module: 'inventory#./RootApp',
      name: 'inventory',
    },
    remediations: {
      manifestLocation:
        'https://console.stage.redhat.com/apps/remediations/fed-mods.json',
      module: 'remediations#./RootApp',
      name: 'remediations',
    },
  },
  factories: {
    inventory: {
      expiration: new Date('01-01-3000'),
      modules: {
        './InventoryTable': {
          __esModule: true,
          default: () => (
            <div>
              <h1>Inventory mock</h1>
            </div>
          ),
        },
        './InventoryDetails': {
          __esModule: true,
          default: () => (
            <div>
              <h1>Inventory Details mock</h1>
            </div>
          ),
        },
      },
    },
    remediations: {
      expiration: new Date('01-01-3000'),
      modules: {
        './RemediationButton': {
          __esModule: true,
          default: () => <button>Remediation button mock</button>,
        },
      },
    },
  },
};
