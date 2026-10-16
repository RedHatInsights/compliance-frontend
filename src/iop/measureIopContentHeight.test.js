import { measureIopContentHeight } from './measureIopContentHeight';

describe('measureIopContentHeight', () => {
  afterEach(() => {
    document.querySelector('.pf-v6-c-page__main')?.remove();
    jest.restoreAllMocks();
  });

  it('returns main scrollHeight plus top offset and parent bottom chrome', () => {
    const main = document.createElement('div');
    main.className = 'pf-v6-c-page__main';
    Object.defineProperty(main, 'scrollHeight', {
      value: 1507,
      configurable: true,
    });
    main.getBoundingClientRect = () => ({ top: 3.75 });
    document.body.appendChild(main);

    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      paddingBottom: '4px',
      borderBottomWidth: '1px',
    });

    expect(measureIopContentHeight()).toBe(1516);
  });

  it('returns 0 when main is missing', () => {
    expect(measureIopContentHeight()).toBe(0);
  });
});
