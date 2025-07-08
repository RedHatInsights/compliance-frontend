import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import useQueryExportData from './useQueryExportData';
import usePDFBuilder from './usePDFBuilder';

// Hook to provide a function that fetches the necessary data to export
// and compile it into pages for the pdf-generator DownloadButton
const usePDFExport = (exportSettings, report) => {
  const addNotification = useAddNotification();
  const queryExportData = useQueryExportData(exportSettings, report, {
    onError: () => {
      addNotification({
        variant: 'danger',
        title: 'Couldn’t download export',
        description: 'Reinitiate this export to try again.',
      });
    },
    onComplete: () => {
      addNotification({
        variant: 'success',
        title: 'Downloading export',
      });
    },
  });
  const buildPDFPages = usePDFBuilder(report);

  const exportPDF = async () => {
    addNotification({
      variant: 'info',
      title: 'Preparing export',
      description: 'Once complete, your download will start automatically.',
    });
    const data = await queryExportData();
    return await buildPDFPages(data);
  };

  return exportPDF;
};

export default usePDFExport;
