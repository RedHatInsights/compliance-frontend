import { downloadItems } from './helpers';
import { exportableColumns } from './helpers';

/**
 *  @typedef {object} withExportReturn
 *
 *  @property {object} toolbarProps              Object containing PrimaryToolbar props
 *  @property {object} toolbarProps.exportConfig Object containing the exportConfig prop for the PrimaryToolbar
 */

/**
 * Provides an `exportConfig` prop for a (Primary)Toolbar action
 *
 *  @param   {object}           [options]            AsyncTableTools options
 *  @param   {Function}         [options.exporter]   Function to return an array of items to be exported
 *  @param   {Array}            [options.columns]    columns for the export
 *  @param   {boolean}          [options.isDisabled] Wether or not export is enabled
 *  @param   {Function}         [options.onStart]    Function to call before the export
 *  @param   {Function}         [options.onComplete] Function to call when the export succeeded
 *  @param   {Function}         [options.onError]    Function to call when there was an error exporting
 *
 *  @returns {withExportReturn}                      Props for PrimaryToolbar component
 *
 *  @category AsyncTableTools
 *  @subcategory functions
 *
 */
const withExport = ({
  exporter,
  columns = [],
  isDisabled = false,
  onStart,
  onComplete,
  onError,
}) => {
  const enableExport = !!exporter;
  const exportColumns = exportableColumns(columns);
  const exportWithFormat = async (format) => {
    onStart?.();
    try {
      const items = await exporter();
      downloadItems(exportColumns, items, format);
      onComplete?.(items);
    } catch (error) {
      onError?.(error);
    }
  };

  return enableExport
    ? {
        toolbarProps: {
          exportConfig: {
            isDisabled,
            onSelect: (_, format) => exportWithFormat(format),
          },
        },
      }
    : {};
};

export default withExport;
