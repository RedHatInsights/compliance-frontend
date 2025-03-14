import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import withExport from '@/Frameworks/AsyncTableTools/utils/withExport';

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

  const {
    toolbarProps: { exportConfig },
  } = withExport({
    exporter,
    columns,
    isDisabled: total === 0,
    onStart,
    onComplete,
    onError,
  });

  return exportConfig;
};

export default useSystemsExport;
