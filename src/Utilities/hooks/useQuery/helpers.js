export const compileResult = (fetchResult, params) => {
  const data = fetchResult.data?.data || fetchResult.data;
  const meta = fetchResult.data?.meta;

  return {
    data,
    meta: {
      ...(meta || {}),
      query: { params },
    },
  };
};
