import { useCallback, useState } from 'react';
import pickBy from 'lodash/pickBy';
import { DEFAULT_EXPORT_SETTINGS } from '../constants';

const preparedSettings = (withReporting = true) =>
  pickBy(
    DEFAULT_EXPORT_SETTINGS,
    (_value, key) => !(key === 'nonReportingSystems' && !withReporting)
  );

const useExportSettings = () => {
  const [exportSettings, setExportSettings] = useState(preparedSettings());

  const setExportSetting = useCallback(
    (setting) => (value) =>
      setExportSettings({
        ...exportSettings,
        [setting]: value,
      }),
    [setExportSettings, exportSettings]
  );

  const isValid = () =>
    Object.keys(exportSettings).some(
      (key) => (key !== 'userNotes' && !!exportSettings[key]) === true
    );

  return {
    exportSettings,
    setExportSetting,
    isValid: isValid(),
  };
};

export default useExportSettings;
