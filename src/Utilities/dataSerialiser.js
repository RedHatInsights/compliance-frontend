import set from 'lodash/set';

const serialiseObject = (object, map) => {
  if (!object || !map) {
    return object;
  }

  const result = {};

  Object.entries(object).forEach(([key, value]) => {
    let paths = Array.isArray(map[key]) ? map[key] : [map[key]];
    paths.forEach((path) => {
      const newPath = path || key;
      set(result, newPath, value);
    });
  });

  return result;
};

export default (data, map) =>
  Array.isArray(data)
    ? data.map((entry) => serialiseObject(entry, map))
    : serialiseObject(data, map);
