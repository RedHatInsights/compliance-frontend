import { adaptChrome } from './adaptChrome';
import { buildAppConfig } from '@/config/appConfig';

describe('adaptChrome', () => {
  it('calls hideGlobalFilter on raw chrome when present', () => {
    const hideGlobalFilter = jest.fn();
    const chrome = adaptChrome({ hideGlobalFilter }, buildAppConfig('hcc'));
    chrome.hideGlobalFilter(true);
    expect(hideGlobalFilter).toHaveBeenCalledWith(true);
  });

  it('does not throw when hideGlobalFilter is missing', () => {
    const chrome = adaptChrome({}, buildAppConfig('hcc'));
    expect(() => chrome.hideGlobalFilter(true)).not.toThrow();
  });

  it('delegates updateDocumentTitle when present', () => {
    const updateDocumentTitle = jest.fn();
    const chrome = adaptChrome({ updateDocumentTitle }, buildAppConfig('hcc'));
    chrome.updateDocumentTitle('Compliance');
    expect(updateDocumentTitle).toHaveBeenCalledWith('Compliance');
  });

  it('sets document.title when API missing and profile allows fallback', () => {
    const originalTitle = document.title;
    const chrome = adaptChrome({}, buildAppConfig('iop'));
    chrome.updateDocumentTitle('IoP title');
    expect(document.title).toBe('IoP title');
    document.title = originalTitle;
  });

  it('does not set document.title when API missing on hcc profile', () => {
    const originalTitle = document.title;
    const chrome = adaptChrome({}, buildAppConfig('hcc'));
    chrome.updateDocumentTitle('Should not apply');
    expect(document.title).toBe(originalTitle);
  });

  it('delegates requestPdf when present', () => {
    const requestPdf = jest.fn(() => 'ok');
    const chrome = adaptChrome({ requestPdf }, buildAppConfig('hcc'));
    expect(chrome.requestPdf({})).toBe('ok');
  });

  it('returns undefined for requestPdf when missing', () => {
    const chrome = adaptChrome({}, buildAppConfig('hcc'));
    expect(chrome.requestPdf({})).toBeUndefined();
  });

  it('exposes auth from raw chrome', () => {
    const auth = { logout: jest.fn() };
    const chrome = adaptChrome({ auth }, buildAppConfig('hcc'));
    expect(chrome.auth).toBe(auth);
  });
});
