import { dispatchNotification } from 'Utilities/Dispatcher';
import useQueryExportData from './useQueryExportData';
import usePDFBuilder from './usePDFBuilder';
import useSupportedSsgFinder from './useSupportedSsgFinder';

// Hook to provide a function that fetches the necessary data to export
// and compile it into pages for the pdf-generator DownloadButton
const usePDFExport = (exportSettings, report) => {
  const ssgFinder = useSupportedSsgFinder();
  const queryExportData = useQueryExportData(exportSettings, report, {
    onError: () => {
      dispatchNotification({
        variant: 'danger',
        title: 'Couldn’t download export',
        description: 'Reinitiate this export to try again.',
      });
    },
    onComplete: () => {
      dispatchNotification({
        variant: 'success',
        title: 'Downloading export',
      });
    },
  });
  const buildPDFPages = usePDFBuilder(report);

  const exportPDF = async () => {
    dispatchNotification({
      variant: 'info',
      title: 'Preparing export',
      description: 'Once complete, your download will start automatically.',
    });
    const data = await queryExportData();
    return await buildPDFPages(data, ssgFinder);
  };

  return exportPDF;
};

export default usePDFExport;
