import { render } from '@testing-library/react';
import ReportChart from './ReportChart';

describe('ReportChart', () => {
  const defaultProps = {
    profile: {
      title: 'TEST Profile name',
      compliant_system_count: 0,
      reported_system_count: 0,
      unsupported_system_count: 0,
      assigned_system_count: 0,
    },
  };

  it('expect to render without error with no profile', () => {
    const component = <ReportChart />;
    const { container } = render(component);

    expect(container).toMatchSnapshot();
  });

  it('expect to render without error with zero counts', () => {
    const component = <ReportChart {...defaultProps} />;
    const { container } = render(component);

    expect(container).toMatchSnapshot();
  });

  it('expect to render with zero unsupported hosts', () => {
    const props = {
      profile: {
        ...defaultProps.profile,
        compliant_system_count: 5,
        reported_system_count: 5,
        unsupported_system_count: 0,
        assigned_system_count: 5,
      },
    };
    const component = <ReportChart {...props} />;
    const { container } = render(component);

    expect(container).toMatchSnapshot();
  });

  it('expect to render with unsupported hosts', () => {
    const props = {
      profile: {
        ...defaultProps.profile,
        compliant_system_count: 5,
        reported_system_count: 5,
        unsupported_system_count: 2,
        assigned_system_count: 5,
      },
    };
    const component = <ReportChart {...props} />;
    const { container } = render(component);

    expect(container).toMatchSnapshot();
  });

  it('expect to render with not reporting hosts', () => {
    const props = {
      profile: {
        ...defaultProps.profile,
        compliant_system_count: 2,
        reported_system_count: 5,
        unsupported_system_count: 0,
        assigned_system_count: 10,
      },
    };
    const component = <ReportChart {...props} />;
    const { container } = render(component);

    expect(container).toMatchSnapshot();
  });
});
