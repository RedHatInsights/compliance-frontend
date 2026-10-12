import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import { useExport } from 'bastilian-tabletools';

export const useSystemsExport = ({ columns, exporter, total }) => {
  const addNotification = useAddNotification();

  const onStart = () =>
    addNotification({
      variant: 'info',
      title: 'Preparing export',
      description: 'Once complete, your download will start automatically.',
    });

  const onComplete = () =>
    addNotification({
      variant: 'success',
      title: 'Downloading export',
    });

  const onError = () =>
    addNotification({
      variant: 'danger',
      title: 'Couldn’t download export',
      description: 'Reinitiate this export to try again.',
    });

  const { isDisabled, exportWithFormat } = useExport({
    exporter,
    columns,
    isDisabled: total === 0,
    onStart,
    onComplete,
    onError,
  });

  if (!exportWithFormat) {
    return undefined;
  }

  return {
    isDisabled,
    onSelect: (_event, format) => exportWithFormat(format),
  };
};

export default useSystemsExport;
