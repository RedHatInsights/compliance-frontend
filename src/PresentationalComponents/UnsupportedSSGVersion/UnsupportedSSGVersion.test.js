import { render } from '@testing-library/react';

import UnsupportedSSGVersion from './UnsupportedSSGVersion';

describe('UnsupportedSSGVersion', () => {
  const defaultProps = {
    style: { margin: '1em' },
  };

  it('expect to render without error', () => {
    const { asFragment } = render(
      <UnsupportedSSGVersion {...defaultProps}>
        Unsupported text
      </UnsupportedSSGVersion>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render no warning sign', () => {
    const { asFragment } = render(
      <UnsupportedSSGVersion {...defaultProps} showWarningIcon={false}>
        Unsupported text
      </UnsupportedSSGVersion>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render tooltip', () => {
    const { asFragment } = render(
      <UnsupportedSSGVersion {...defaultProps} tooltipText="TOOLTIP TEXT">
        Unsupported text
      </UnsupportedSSGVersion>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render help sign', () => {
    const { asFragment } = render(
      <UnsupportedSSGVersion {...defaultProps} showHelpIcon={true}>
        Unsupported text
      </UnsupportedSSGVersion>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render singular message', () => {
    const { asFragment } = render(
      <UnsupportedSSGVersion {...defaultProps} messageVariant="singular">
        Unsupported text
      </UnsupportedSSGVersion>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
