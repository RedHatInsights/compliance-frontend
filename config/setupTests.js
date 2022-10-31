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

if (!process.env.DEBUG) {
  global.console.log = () => {
    return;
  };
  global.console.warn = () => {
    return;
  };
  global.console.info = () => {
    return;
  };
}

global.renderJson = (component) => toJson(shallow(component));
jest.mock('@scalprum/react-core', () => ({
  ...jest.requireActual('@scalprum/react-core'),
  // eslint-disable-next-line
  ScalprumComponent: ({ appName, module }) => (
    <div>
      Async Component: {appName} - {module}
    </div>
  ),
}));
