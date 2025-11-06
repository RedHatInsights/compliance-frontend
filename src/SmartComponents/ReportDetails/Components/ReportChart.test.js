import { render } from '@testing-library/react';
import ReportChart from './ReportChart';

describe('ReportChart', () => {
  it('expect to render without error with zero counts', () => {
    const component = <ReportChart />;
    const { container } = render(component);

    expect(container).toMatchSnapshot();
  });

  it('expect to render with 2 unsupported & 3 never reported hosts', () => {
    const reportData = {
      assigned_system_count: 10,
      reported_system_count: 7,
      unsupported_system_count: 2,
      compliant_system_count: 4,
      never_reported_system_count: 3,
      percent_compliant: 40,
    };

    const component = <ReportChart report={reportData} />;
    const { container } = render(component);

    expect(container).toMatchSnapshot();
  });

  it('expect to render with 0 unsupported & 0 never reported hosts', () => {
    const reportData = {
      assigned_system_count: 5,
      reported_system_count: 5,
      unsupported_system_count: 0,
      compliant_system_count: 4,
      never_reported_system_count: 0,
      percent_compliant: 80,
    };

    const component = <ReportChart report={reportData} />;
    const { container } = render(component);

    expect(container).toMatchSnapshot();
  });
});
