import {
  defaultCompileResult,
  compileTotalResult,
  hasRequiredParams,
  fetchResult,
  combineParamsWithTableState,
} from './helpers.js';

describe('useTableToolsQuery helpers', () => {
  it('expect defaultCompileResult return correct data', () => {
    const result = defaultCompileResult({
      data: { data: [1, 2, 3], meta: { total: 3 } },
    });
    expect(result).toEqual({ data: [1, 2, 3], meta: { total: 3 } });
  });
  it('defaultCompileResult handles fallback data structure', () => {
    const result = defaultCompileResult({ data: [1, 2, 3] }, { page: 1 });

    expect(result).toEqual({
      data: [1, 2, 3],
      meta: { page: 1 },
    });
  });

  it('compileTotalResult return correct data', () => {
    const result = compileTotalResult({ data: { meta: { total: 10 } } });
    expect(result).toEqual(10);
  });

  it('hasRequiredParams returns true when no required params', () => {
    const result = hasRequiredParams(null, { param1: 'value1' });
    expect(result).toBe(true);
  });

  it('hasRequiredParams doesnt raise an error when all params are present', () => {
    console.error = jest.fn();
    hasRequiredParams(['param1', 'param2'], {
      param1: 'value1',
      param2: 'value2',
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it('hasRequiredParams handles a single string for requiredParams', () => {
    console.error = jest.fn();
    hasRequiredParams('param1');
    expect(console.error).toHaveBeenCalledWith(
      "Missing required parameter: 'param1'",
    );
  });

  it('hasRequiredParams logs error when missing param', () => {
    console.error = jest.fn();
    hasRequiredParams(['param1', 'param2'], { param1: 'value1' });
    expect(console.error).toHaveBeenCalledWith(
      "Missing required parameter: 'param2'",
    );
  });

  it('fetchResult calls fn with converted params and compiles result', async () => {
    const mockApiCall = jest.fn().mockResolvedValue({ data: 'raw data' });
    const mockConvertToArray = jest.fn((params) => [params.id, params.options]);
    const mockCompileResult = jest.fn(() => 'compiled result');
    const params = { id: 123, options: { sort: 'asc' } };

    const result = await fetchResult(
      mockApiCall,
      params,
      mockConvertToArray,
      mockCompileResult,
    );
    expect(mockConvertToArray).toHaveBeenCalledWith(params);
    expect(mockApiCall).toHaveBeenCalledWith(123, { sort: 'asc' });
    expect(mockCompileResult).toHaveBeenCalledWith(
      { data: 'raw data' },
      params,
    );
    expect(result).toBe('compiled result');
  });

  it('combineParamsWithTableState merges filters correctly', () => {
    const tableStateParams = { page: 1, limit: 10, filters: 'name="foo"' };
    const additionalParams = { filters: 'with_reported_systems=true' };
    const result = combineParamsWithTableState(
      tableStateParams,
      additionalParams,
    );
    expect(result).toEqual({
      page: 1,
      limit: 10,
      filters: '(name="foo") AND (with_reported_systems=true)',
    });
  });

  it('combineParamsWithTableState handles only one set of params', () => {
    const tableStateParams = { page: 1, filters: 'name="foo"' };
    let result = combineParamsWithTableState(tableStateParams, null);
    expect(result).toEqual({ page: 1, filters: 'name="foo"' });

    const additionalParams = { filters: 'with_reported_systems=true' };
    result = combineParamsWithTableState(null, additionalParams);
    expect(result).toEqual({ filters: 'with_reported_systems=true' });
  });
});
