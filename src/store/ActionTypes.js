export const EXPORT_TO_CSV = '@@COMPLIANCE/EXPORT_TO_CSV';

export const exportFromState = (format) => ({
    type: EXPORT, payload: { format }
});

