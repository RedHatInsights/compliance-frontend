import set from 'lodash/set';
import get from 'lodash/get';

const serialiseObject = (object, map) => {
  if (!object || !map) {
    return object;
  }

  const result = {};

  Object.entries(map).forEach(([key, value]) => {
    let paths = Array.isArray(value) ? value : [value];
    paths.forEach((path) => {
      set(result, path, get(object, key));
    });
  });

  return result;
};

export default (data, map) =>
  Array.isArray(data)
    ? data.map((entry) => serialiseObject(entry, map))
    : serialiseObject(data, map);
