import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import SelectedFilterSwitch from './SelectedFilterSwitch';

describe('SelectedFilterSwitch', () => {
  it('expect to render without error', () => {
    const component = <SelectedFilterSwitch />;

    expect(toJson(shallow(component))).toMatchSnapshot();
  });

  it('expect to render without error', () => {
    const component = <SelectedFilterSwitch isChecked={false} />;

    expect(toJson(shallow(component))).toMatchSnapshot();
  });
});
