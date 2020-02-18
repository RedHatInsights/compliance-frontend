const CSV_FILE_PREFIX = 'compliance-export';

export const linkAndDownload = (data, filename) => {
    let link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.dispatchEvent(new MouseEvent(`click`, { bubbles: true, cancelable: true, view: window }));
};

const getNestedObject = (nestedObj, path) => {
    return path.split('.').reduce(
        (obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj
    );
};

const textCsvCell = (row, key) => {
    let cell = getNestedObject(row, key);

    if (typeof(cell) === 'object') {
        cell = getNestedObject(row, key + '_text');
    }

    if (typeof(cell) === 'string' && cell.includes(',')) {
        cell = '"' + cell + '"';
    }

    return cell;
};

export const csvFromState = (state) => {
    if (state.rows) {
        const CELL_DELIMITER = ',';
        let csvRows = [state.columns.map((column) => column.title).join(CELL_DELIMITER)];
        csvRows = csvRows.concat(state.rows.map((row) => {
            return state.columns.map((column) => textCsvCell(row, column.key)).join(CELL_DELIMITER);
        }));
        return encodeURI('data:text/csv;charset=utf-8,' + csvRows.join('\n'));
    }
};

export const filename = (format = 'csv') => {
    return CSV_FILE_PREFIX + '-' + (new Date()).toISOString() + '.' + format;
};

export const downloadCsv = (state) => {
    const csv = csvFromState(state);
    if (csv) {
        linkAndDownload(csv, filename());
    }
};
