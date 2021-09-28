import { useState } from 'react';
import { DEFAULT_EXPORT_SETTINGS } from '../constants';

const useExportSettings = () => {
  const [exportSettings, setExportSettings] = useState(DEFAULT_EXPORT_SETTINGS);

  const setExportSetting = (setting) => (value) =>
    setExportSettings({
      ...exportSettings,
      [setting]: value,
    });

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
