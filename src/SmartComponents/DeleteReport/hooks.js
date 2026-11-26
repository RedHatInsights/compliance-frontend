import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import { getTerm } from '@/Utilities/helpers';

export const useHandleDeleteReport = () => {
  const addNotification = useAddNotification();

  return async (operation, onDelete, onClose) => {
    try {
      await operation();
      addNotification({
        variant: 'success',
        title: 'Report deleted',
        description: `${getTerm('system', { plural: true })} associated with this policy will upload reports on the next check-in.`,
      });
      onDelete();
    } catch (error) {
      addNotification({
        variant: 'danger',
        title: 'Error removing report',
        description: error?.message,
      });
      onClose();
    }
  };
};
