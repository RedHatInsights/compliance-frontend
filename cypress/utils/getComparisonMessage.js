const getComparisonMessage = (field, expected, actual) => 
  `${field} comparison failed: Expected "${expected}", but got "${actual}"`;

export default getComparisonMessage;
