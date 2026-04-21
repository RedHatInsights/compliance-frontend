export const hasMaxDecimals = (num, dec) =>
  new RegExp(`^[-]?\\d+(\\.\\d{1${dec > 1 ? ',' + dec : ''}})?$`, 'g').test(
    num.toString(),
  );

export const thresholdValid = (threshold) => {
  const parsedThreshold = parseFloat(threshold);
  return (
    parsedThreshold <= 100 &&
    parsedThreshold >= 0 &&
    hasMaxDecimals(parsedThreshold, 1)
  );
};
