import { NoResultsTable } from './NoResultsTable';

describe('NoResultsTable', () => {
  it('expect to render without error', () => {
    expect(renderJson(<NoResultsTable />)).toMatchSnapshot();
  });
});
