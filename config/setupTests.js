import 'jest-canvas-mock';
import { configure, mount, render, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import 'babel-polyfill';

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;
global.toJson = toJson;
global.fetch = function () {};
