import { render } from '@testing-library/react';
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
    const { asFragment } = render(
      <ReportStatusBar hostCounts={defaultHostCounts} />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render without error with no reporting systems', () => {
    const hostCounts = {
      ...defaultHostCounts,
      compliant: 0,
      totalResults: 0,
    };

    const { asFragment } = render(<ReportStatusBar hostCounts={hostCounts} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
