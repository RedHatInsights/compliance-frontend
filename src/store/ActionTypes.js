export const EXPORT_TO_CSV = '@@COMPLIANCE/EXPORT_TO_CSV';

export const exportToCSV = (event) => {
    event.preventDefault();
    return { type: EXPORT_TO_CSV };
};
