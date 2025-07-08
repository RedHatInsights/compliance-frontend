import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';

const useComplianceTableDefaults = () => {
  const addNotification = useAddNotification();

  return {
    exportable: {
      onStart: () => {
        addNotification({
          variant: 'info',
          title: 'Preparing export',
          description: 'Once complete, your download will start automatically.',
        });
      },
      onComplete: () => {
        addNotification({
          variant: 'success',
          title: 'Downloading export',
        });
      },
    },
    manageColumns: true,
  };
};

export default useComplianceTableDefaults;
