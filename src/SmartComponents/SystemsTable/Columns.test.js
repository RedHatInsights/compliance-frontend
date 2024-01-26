/* eslint-disable testing-library/render-result-naming-convention */
import { customColumn, compileColumnRenderFunc } from './Columns';

const TestCell = () => <span>Test Cell</span>;
const column = {
  key: 'columnKey',
  title: 'Column title',
  props: {
    width: 40,
  },
  cell: TestCell,
};

describe('compileColumnRenderFunc', () => {
  it('a column with a renderFunc', () => {
    const compiledColumn = compileColumnRenderFunc(column);
    expect(compiledColumn).toMatchSnapshot();
  });
});

describe('compileColumnRenderFunc', () => {
  it('a column with custom props appended', () => {
    const customColumnResult = customColumn(column, { isStatic: true });
    expect(customColumnResult).toMatchSnapshot();
  });
});
