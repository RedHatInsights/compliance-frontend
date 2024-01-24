import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import UnsupportedSSGVersion from './UnsupportedSSGVersion';

describe('UnsupportedSSGVersion', () => {
  const defaultProps = {
    style: { margin: '1em' },
  };

  it('expect to render without error', () => {
    render(
      <UnsupportedSSGVersion {...defaultProps}>
        Unsupported text
      </UnsupportedSSGVersion>
    );

    expect(
      screen.getByLabelText('Unsupported SSG Version warning')
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('expect to render no warning sign', () => {
    render(
      <UnsupportedSSGVersion {...defaultProps} showWarningIcon={false}>
        Unsupported text
      </UnsupportedSSGVersion>
    );

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('expect to render tooltip', () => {
    render(
      <UnsupportedSSGVersion {...defaultProps} tooltipText="TOOLTIP TEXT">
        Unsupported text
      </UnsupportedSSGVersion>
    );

    expect(screen.getByLabelText('Tooltip icon')).toBeInTheDocument();
  });

  it('expect to render help sign', () => {
    render(
      <UnsupportedSSGVersion {...defaultProps} showHelpIcon={true}>
        Unsupported text
      </UnsupportedSSGVersion>
    );

    expect(screen.getByLabelText('Help icon')).toBeInTheDocument();
  });
});
