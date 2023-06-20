import { dispatchNotification } from 'Utilities/Dispatcher';

const CRC_PDF_GENERATE_API = '/api/crc-pdf-generator/v1/generate';
const fetchPDF = (service, template, params) => {
  const url = new URL(CRC_PDF_GENERATE_API, window.location.origin);
  try {
    console.log(url);
    return fetch(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          service,
          template,
          params,
        }),
      },
      50000
    ).then((response) => response.blob());
  } catch (e) {
    console.log(e);
    dispatchNotification({
      variant: 'danger',
      title: 'Couldn’t download export',
      description: 'Reinitiate this export to try again.',
    });
  }
};

const renderPDF = (pdfBlob, fileName = 'new-report') => {
  const url = window.URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

// Hook to provide a function that fetches the necessary data to export
// and compile it into pages for the pdf-generator DownloadButton
const usePDFExport = (service) => {
  const exportPDF = async (template, exportSettings, filename) => {
    dispatchNotification({
      variant: 'info',
      title: 'Preparing export',
      description: 'Once complete, your download will start automatically.',
    });
    try {
      const pdfBlob = await fetchPDF(service, template, exportSettings);
      renderPDF(pdfBlob, filename);
      dispatchNotification({
        variant: 'success',
        title: 'Downloading export',
      });
    } catch (e) {
      console.log(e);
    }
  };

  return exportPDF;
};

export default usePDFExport;
