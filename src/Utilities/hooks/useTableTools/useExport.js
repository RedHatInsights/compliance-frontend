import { camelCase, getProperty } from 'Utilities/helpers';

const CSV_FILE_PREFIX = 'compliance-export';
const CSV_DELIMITER = ',';
const ENCODINGS = {
    csv: 'text/csv',
    json: 'application/json'
};

const filename = (format) => (
    CSV_FILE_PREFIX + '-' + (new Date()).toISOString() + '.' + format
);

const encoding = (format) => (
    `data:${ ENCODINGS[format] };charset=utf-8`
);

export const linkAndDownload = (data, filename) => {
    const link = document.createElement('a');
    link.href = data;
    link.download = filename;
    link.click();
};

const textForCell = (row, column) => {
    const { exportKey, renderExport } = column;
    let cell = exportKey ? getProperty(row, exportKey) : row;
    if (renderExport) {
        return renderExport(cell);
    } else {
        return cell;
    }
};

export const csvForItems = ({ items, columns }) => {
    const header = columns.map((column) => (column.title)).join(CSV_DELIMITER);
    const csvRows = [header, ...items.map((row) => (
        columns.map((column) => (
            `"${ textForCell(row, column) }"`
        )).join(CSV_DELIMITER)
    ))];

    return encodeURI(`${ encoding('csv') },${ csvRows.join('\n') }`);
};

export const jsonForItems = ({ items, columns }) => {
    const result = items.map((row) => (
        columns.reduce((object, column) => {
            const key = camelCase(column.title);
            const value = textForCell(row, column);

            object[key] = value;
            return object;
        }, {})
    ));

    return encodeURI(`${ encoding('json') },${ JSON.stringify(result) }`);
};

const useExport = ({
    exporter,
    columns = [],
    isDisabled = false
}) => {
    const exportableColumns = columns.filter((column) => (
        column.export !== false && (column.exportKey || column.renderExport)
    ));
    const exportWithFormat = async (format) => {
        const items = await exporter();
        const formater = format === 'csv' ? csvForItems : jsonForItems;

        if (items) {
            return linkAndDownload(formater({
                items,
                columns: exportableColumns
            }), filename(format));
        } else {
            console.info('No items returned for export');
            return;
        }
    };

    return {
        toolbarProps: {
            exportConfig: {
                isDisabled,
                onSelect: (_, format) => exportWithFormat(format)
            }
        }
    };
};

export default useExport;
