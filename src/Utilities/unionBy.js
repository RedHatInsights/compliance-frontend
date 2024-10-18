const unionBy = (arr, ...args) => {
  let iteratee = args.pop();
  if (typeof iteratee === 'string') {
    const prop = iteratee;
    iteratee = (item) => item[prop];
  }

  return arr
    .concat(...args)
    .filter(
      (x, i, self) => i === self.findIndex((y) => iteratee(x) === iteratee(y))
    );
};

export default unionBy;
