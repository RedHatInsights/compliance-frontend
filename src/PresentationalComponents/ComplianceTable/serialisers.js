// TODO correct the serialiser to transform state put into the tablestate to be API consumable
export const paginationSerialiser = (state) =>
  `offset=${state.page}&limit=${state.perPage}`;
