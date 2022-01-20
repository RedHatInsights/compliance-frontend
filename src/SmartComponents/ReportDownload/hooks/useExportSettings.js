import { useState } from 'react';
import pickBy from 'lodash/pickBy';
import useFeature from 'Utilities/hooks/useFeature';
import { DEFAULT_EXPORT_SETTINGS } from '../constants';

const preparedSettings = (withReporting) =>
  pickBy(
    DEFAULT_EXPORT_SETTINGS,
    (_value, key) => !(key === 'nonReportingSystems' && !withReporting)
  );

const useExportSettings = () => {
  const systemsNotReporting = useFeature('systemsNotReporting');
  const [exportSettings, setExportSettings] = useState(
    preparedSettings(systemsNotReporting)
  );

  const setExportSetting = (setting) => (value) =>
    setExportSettings({
      ...exportSettings,
      [setting]: value,
    });

  const isValid = () =>
    Object.keys(exportSettings).some(
      (key) => (key !== 'userNotes' && !!exportSettings[key]) === true
    );
  console.log(exportSettings);
  return {
    exportSettings,
    setExportSetting,
    isValid: isValid(),
  };
};

export default useExportSettings;
