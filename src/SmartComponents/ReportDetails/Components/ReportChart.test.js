import { render } from '@testing-library/react';
import ReportChart from './ReportChart';

describe('ReportChart', () => {
  const defaultProps = {
    profile: {
      name: 'TEST Profile name',
      compliantHostCount: 0,
      testResultHostCount: 0,
      unsupportedHostCount: 0,
      totalHostCount: 0,
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
        compliantHostCount: 5,
        testResultHostCount: 5,
        unsupportedHostCount: 0,
        totalHostCount: 5,
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
        compliantHostCount: 5,
        testResultHostCount: 5,
        unsupportedHostCount: 2,
        totalHostCount: 5,
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
        compliantHostCount: 2,
        testResultHostCount: 5,
        unsupportedHostCount: 0,
        totalHostCount: 10,
      },
    };
    const component = <ReportChart {...props} />;
    const { container } = render(component);

    expect(container).toMatchSnapshot();
  });
});
