import { renderHook, act } from '@testing-library/react';
import { DEFAULT_EXPORT_SETTINGS } from '../constants';
import useExportSettings from './useExportSettings';

describe('useExportSettings', () => {
  const settingsKeys = Object.keys(DEFAULT_EXPORT_SETTINGS);

  it('returns an object to get and set export settings', () => {
    const { result } = renderHook(() => useExportSettings());
    expect(result).toMatchSnapshot();
  });

  describe('setEsportSetting', function () {
    it('sets a setting value', () => {
      const { result } = renderHook(() => useExportSettings());
      const setting =
        settingsKeys[Math.floor(Math.random() * settingsKeys.length)];
      const oldSetting = result.current.exportSettings[setting];
      const newSetting = !oldSetting;

      act(() => {
        result.current.setExportSetting(setting)(newSetting);
      });

      expect(result.current.exportSettings[setting]).toEqual(newSetting);
    });
  });

  describe('isValid', function () {
    it('returns false if all settings are disabled', () => {
      const { result } = renderHook(() => useExportSettings());
      expect(result.current.isValid).toBe(true);

      settingsKeys.forEach((setting) => {
        if (setting !== 'userNotes') {
          act(() => {
            result.current.setExportSetting(setting)(false);
          });
        }
      });

      expect(result.current.isValid).toBe(false);
    });
  });
});
