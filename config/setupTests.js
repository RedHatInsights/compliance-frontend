import fetch from 'cross-fetch';
import { configure, mount, render, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import 'babel-polyfill';

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;
global.fetch = fetch;
global.toJson = toJson;

// https://github.com/facebook/jest/issues/2098#issuecomment-260733457
const localStorageMock = (() => {
    let store = {};

    return {
        getItem(key) {
            return store[key] || null;
        },
        setItem(key, value) {
            store[key] = value.toString();
        },
        clear() {
            store = {};
        }
    };

})();

global.localStorageMock = localStorageMock;

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});
