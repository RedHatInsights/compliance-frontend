import { useQuery } from '@apollo/client';
import usePDFExport from '@redhat-cloud-services/frontend-components-utilities/useExportPDF';

jest.mock('@apollo/client');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ policy_id: '1' }), // eslint-disable-line
  useLocation: jest.fn(),
  useHistory: jest.fn(() => ({})),
}));
jest.mock('Utilities/Dispatcher');
jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/useExportPDF',
  () => () => []
);

describe('ReportDownload', function () {
  const exportFunMock = jest.fn(() => Promise.resolve([]));
  const useExportFuncMock = jest.fn(() => exportFunMock);
  // TODO Unskip when mocking of pdf-generator components is possible
  it.skip('expect to render without error', () => {
    usePDFExport.mockImplementation(useExportFuncMock);
    useQuery.mockImplementation(() => ({
      data: {
        profile: {
          name: 'Test Profile',
        },
      },
      error: undefined,
      loading: undefined,
    }));

    expect(useExportFuncMock).toHaveBeenCalledWith(
      {
        compliantSystems: false,
        nonCompliantSystems: true,
        topTenFailedRules: true,
        unsupportedSystems: true,
        userNotes: undefined,
      },
      { name: 'Test Profile' }
    );
  });
});
