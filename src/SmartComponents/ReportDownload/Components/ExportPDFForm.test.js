import { render } from '@testing-library/react';
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
});
