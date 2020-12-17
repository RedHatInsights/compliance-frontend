const CSV_FILE_PREFIX = 'compliance-export';
const CSV_DELIMITER = ',';

const linkAndDownload = (data, filename) => {
    if (!data) {
        return;
    }

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

    if (cell.exportValue) {
        cell = cell.exportValue;
    }

    if (typeof(cell) === 'object') {
        cell = getNestedObject(row, key + '_text');
    }

    if (typeof(cell) === 'string' && cell.includes(',')) {
        cell = '"' + cell + '"';
    }

    return cell;
};

export const csvFromState = (state) => {
    const { rows, columns, selectedEntities } = state;

    if (rows) {
        let csvRows = [columns.map((column) => column.title).join(CSV_DELIMITER)];
        csvRows = csvRows.concat((selectedEntities || rows).map((row) => (
            state.columns.map((column) => !column.noExport ? textCsvCell(row, column.key) : '').join(CSV_DELIMITER)
        )));

        return encodeURI('data:text/csv;charset=utf-8,' + csvRows.join('\n'));
    }
};

export const jsonFromState = (state) => {
    const { rows, columns, selectedEntities } = state;
    let result;

    if (rows) {
        result = (selectedEntities || rows).map((row) => {
            let object = {};
            columns.forEach((column) => {
                const keys = column.key.split('.');
                const key = keys[keys.length - 1];
                object[key] = textCsvCell(row, column.key);
            });

            return object;
        });

        return encodeURI('data:application/json;charset=utf-8,' + JSON.stringify(result));
    }
};

const filename = (format) => (
    CSV_FILE_PREFIX + '-' + (new Date()).toISOString() + '.' + format
);

export const exportFromState = (state, format) => {
    let content;

    if (format === 'csv') {
        content = csvFromState(state);
    } else if (format === 'json') {
        content = jsonFromState(state);
    }

    linkAndDownload(content, filename(format));
};

