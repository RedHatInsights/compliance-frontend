import { APIFactory } from '@redhat-cloud-services/javascript-clients-shared';
import { instance } from '@redhat-cloud-services/frontend-components-utilities/interceptors';
import * as complianceApi from '@redhat-cloud-services/compliance-client';
import { API_BASE_URL } from '@/constants';

export const apiInstance = APIFactory(API_BASE_URL, complianceApi, instance);

const defaultCompileResult = (fetchResult) => fetchResult;

export const fetchResult = async (
  fn,
  params,
  convertToArray,
  compileResult = defaultCompileResult
) => {
  const convertedParams =
    (convertToArray && !Array.isArray(params)
      ? convertToArray(params)
      : params) || [];

  if (Array.isArray(convertedParams)) {
    return compileResult(await fn(...convertedParams), params);
  } else {
    return compileResult(await fn(convertedParams), params);
  }
};
