const joinComponents = (array, seperator = '') => (
    array.reduce((prev, curr) => [prev, curr && seperator, curr])
);

export default joinComponents;
