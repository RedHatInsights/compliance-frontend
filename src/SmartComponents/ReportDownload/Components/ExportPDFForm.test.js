import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DEFAULT_EXPORT_SETTINGS } from '../constants';
import ExportPDFForm from './ExportPDFForm';

jest.mock('Utilities/Dispatcher');

describe('ExportPDFForm', function () {
  const defaultProps = {
    policy: {
      name: 'Policy Test Name',
    },
    exportSettings: {
      ...DEFAULT_EXPORT_SETTINGS,
      userNotes: 'NOTE',
    },
    setExportSetting: () => ({}),
  };

  it('expect to render without error', () => {
    const { container } = render(<ExportPDFForm {...defaultProps} />);

    expect(container).toMatchSnapshot();
  });

  it('expect to render without error with different export settings', () => {
    const componentProps = {
      ...defaultProps,
      exportSettings: {
        ...DEFAULT_EXPORT_SETTINGS,
        compliantSystems: true,
        unsupportedSystems: false,
        userNotes: 'NOTE',
      },
    };
    const { container } = render(<ExportPDFForm {...componentProps} />);

    expect(container).toMatchSnapshot();
  });

  it('expect checkboxes being (un)checked', () => {
    const componentProps = {
      ...defaultProps,
      exportSettings: {
        ...DEFAULT_EXPORT_SETTINGS,
        compliantSystems: true,
        unsupportedSystems: false,
        userNotes: 'NOTE',
      },
    };
    render(<ExportPDFForm {...componentProps} />);

    expect(screen.getByLabelText('Compliant systems')).toBeChecked();
    expect(
      screen.getByLabelText('Systems with unsupported configuration')
    ).not.toBeChecked();
  });
});
