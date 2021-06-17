import NoResultsTable, { emptyRows } from './NoResultsTable';

describe('NoResultsTable', () => {
  it('expect to render without error', () => {
    const wrapper = shallow(<NoResultsTable />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('emptyRows', () => {
  it('expect to render without error', () => {
    expect(emptyRows).toMatchSnapshot();
  });
});
