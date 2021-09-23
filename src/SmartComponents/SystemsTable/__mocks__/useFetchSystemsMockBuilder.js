const useFetchSystemsMockBuilder = (
  result = {
    entities: [],
    meta: {
      totalCount: 0,
    },
  }
) => {
  return ({ onComplete }) => {
    return () => {
      onComplete && onComplete(result);
      return Promise.resolve(result);
    };
  };
};

export default useFetchSystemsMockBuilder;
