import { useState } from 'react';
import { thresholdValid } from '../../../SmartComponents/CreatePolicy/validate';

const useThresholdField = (previousThreshold) => {
  const [{ threshold, validThreshold }, setThreshold] = useState({
    validThreshold: thresholdValid(previousThreshold),
    threshold: previousThreshold,
  });

  const onThresholdChange = (threshold) => {
    setThreshold({
      validThreshold: thresholdValid(threshold),
      threshold: threshold,
    });
  };

  return { threshold, validThreshold, onThresholdChange };
};

export default useThresholdField;
