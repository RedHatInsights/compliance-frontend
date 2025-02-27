import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { dispatchAction } from '../../Utilities/Dispatcher';

export const handleDeleteReport = async (operation, onDelete, onClose) => {
  try {
    await operation();
    dispatchAction(
      addNotification({
        variant: 'success',
        title: 'Report deleted',
        description:
          'Systems associated with this policy will upload reports on the next check-in.',
      })
    );
    onDelete();
  } catch (error) {
    dispatchAction(
      addNotification({
        variant: 'danger',
        title: 'Error removing report',
        description: error?.message,
      })
    );
    onClose();
  }
};
