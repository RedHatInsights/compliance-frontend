import { render } from '@testing-library/react';
import { queryByText, queryByLabelText } from '@testing-library/dom';
import columns from '../PoliciesTable/Columns';

import LoadingPoliciesTable from './LoadingPoliciesTable';

describe('LoadingPoliciesTable', () => {
  it('expect to render without error', () => {
    const { container } = render(<LoadingPoliciesTable />);

    expect(queryByLabelText(container, 'policies-table')).not.toBeNull();

    columns.forEach(({ title }) => {
      expect(queryByText(container, title)).not.toBeNull();
    });
  });
});
