const getIdProp = (item, idProp = 'id') => item[idProp];

const identify = (item, identifier) => {
  if (typeof identifier === 'string') {
    return {
      ...item,
      itemId: getIdProp(item, identifier),
    };
  } else {
    return {
      ...item,
      itemId: identifier(item),
    };
  }
};

export const useItemIdentify = (items, options = {}) => {
  const identifier = options?.identifier || getIdProp;

  return items.map((item) => identify(item, identifier));
};

export default useItemIdentify;
