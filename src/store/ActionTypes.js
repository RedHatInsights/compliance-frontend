export const EXPORT = '@@COMPLIANCE/EXPORT';
export const SELECT_ENTITY = 'SELECT_ENTITY';

export const exportFromState = (format) => ({
    type: EXPORT, payload: { format }
});

export const selectAll = () => ({
    type: SELECT_ENTITY,
    payload: { id: 0, selected: true }
});

export const clearSelection = () => ({
    type: SELECT_ENTITY,
    payload: { id: 0, selected: false }
});
