import { shallow } from 'enzyme';
import ReportStatusBar from './ReportStatusBar';
window.ResizeObserver = class {
  constructor() {}

  observe() {}
};

const defaultHostCounts = {
  compliant: 5,
  totalResults: 10,
  unsupported: 2,
  total: 15,
};

describe('ReportStatusBar', () => {
  it('expect to render without error', () => {
    const wrapper = shallow(<ReportStatusBar hostCounts={defaultHostCounts} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('expect to render without error with no reporting systems', () => {
    const hostCounts = {
      ...defaultHostCounts,
      compliant: 0,
      totalResults: 0,
    };

    const wrapper = shallow(<ReportStatusBar hostCounts={hostCounts} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
