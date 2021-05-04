import _ from 'lodash';

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

const textCsvCell = (row, column) => {
    const { exportKey, renderExport } = column;
    let cell = exportKey ? _.at(row, exportKey)[0] : row;
    if (renderExport) {
        cell = renderExport(cell);
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
            state.columns.map((column) => (column.export !== false) ? textCsvCell(row, column) : '').join(CSV_DELIMITER)
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
                const key = _.snakecase(column.title);
                if (column.export !== false) {
                    object[key] = textCsvCell(row, column);
                }
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
