
export const exportNotifications = {
  pending: {
    title: `Preparing export.`,
    description: 'Once complete, your download will start automatically.',
    variant: 'info',
  },
  success: {
    title: `Downloading export`,
    variant: 'success',
  },
  error: {
    title: 'Couldn’t download export',
    variant: 'danger',
    autoDismiss: false,
  },
};