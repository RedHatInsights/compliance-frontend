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
      const newObjectKeys = path.split(';');
      newObjectKeys.forEach((newKey) => {
        set(result, newKey, get(object, key));
      });
    });
  });

  return result;
};

/**
 * Helper function to transform an object with provided old key-value pairs to a new object with different key-value pairs.
 * The funtion uses lodash **set** utility to read an object value that may be in one or more depth object prototype heriarchy and
 * uses lodash **get** utility to place it into a new path that maybe again in one or more depth object prototype heriarchy.
 *
 *  @param   {data}   data - an object that is intended to be transformed
 *  @param   {map}    map  - transformation map with the keys as old path to a value and values as the new path to a value.
 *                         In case, a value of type string has special character **;**, then  the map value is destructured and the associated object value with its old path is put into two distinct places with destructered pathes.
 *
 *  @returns {object}      - transformed object
 *
 * @example
 * const map = {
 *  ref_id: 'refId',
 *  profile_title: 'name;policyType',
 * }
 *
 * const data = {
 *  ref_id: 'some-ref-id',
 *  profile_title: 'some-profile-title'
 * }
 *
 * const result = dataTransformer(apiInstance.policies);
 * console.log(result); //outputs  => { refId: 'some-ref-id', name: 'some-profile-title', policyType: 'some-profile-title' }
 */
export default (data, map) =>
  Array.isArray(data)
    ? data.map((entry) => serialiseObject(entry, map))
    : serialiseObject(data, map);
