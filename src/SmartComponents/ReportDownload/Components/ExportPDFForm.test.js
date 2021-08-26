import { render } from '@testing-library/react';

import ExportPDFForm from './ExportPDFForm';

describe('ExportPDFForm', function () {
  const defaultProps = {
    policy: {
      name: 'Policy Test Name',
    },
    exportSettings: {
      compliantSystems: true,
      nonCompliantSystems: true,
      unsupportedSystems: false,
      topTenFailedRules: true,
      userNotes: 'NOTE',
    },
    setExportSetting: () => ({}),
  };

  it('expect to render without error', () => {
    const { container } = render(<ExportPDFForm {...defaultProps} />);

    expect(container).toMatchSnapshot();
  });
});
