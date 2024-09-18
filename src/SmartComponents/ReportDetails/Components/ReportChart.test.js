import { render } from '@testing-library/react';
import ReportChart from './ReportChart';
import useAPIV2FeatureFlag from '../../../Utilities/hooks/useAPIV2FeatureFlag';

jest.mock('../../../Utilities/hooks/useAPIV2FeatureFlag');

describe('ReportChart', () => {
  beforeEach(() => {
    useAPIV2FeatureFlag.mockImplementation(() => false);
  });
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

describe('ReportChartAPIv2', () => {
  beforeEach(() => {
    useAPIV2FeatureFlag.mockImplementation(() => true);
  });
  const defaultProps = {
    profile: {
      name: 'TEST Profile name',
      compliantHostCount: 4,
      testResultHostCount: 7,
      unsupportedHostCount: 2,
      totalHostCount: 10,
    },
  };

  it('expect to render with 2 unsupported & 3 never reported hosts', () => {
    const component = <ReportChart {...defaultProps} />;
    const { container } = render(component);

    expect(container).toMatchSnapshot();
  });

  it('expect to render with 0 unsupported & 0 never reported hosts', () => {
    const props = {
      profile: {
        ...defaultProps.profile,
        compliantHostCount: 4,
        testResultHostCount: 5,
        unsupportedHostCount: 0,
        totalHostCount: 5,
      },
    };
    const component = <ReportChart {...props} />;
    const { container } = render(component);

    expect(container).toMatchSnapshot();
  });
});
