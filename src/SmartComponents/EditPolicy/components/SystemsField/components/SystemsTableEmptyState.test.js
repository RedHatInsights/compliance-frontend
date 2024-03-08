import { render } from '@testing-library/react';
import { queryByText } from '@testing-library/dom';
import SystemsTableEmptyState from './SystemsTableEmptyState';

describe('SystemsTableEmptyState', () => {
  it('expected to render', () => {
    const component = <SystemsTableEmptyState osMajorVersion="7" />;
    const { container } = render(component);

    expect(queryByText(container, 'RHEL 7')).not.toBeNull();
  });

  it('expected to render with a different OS name', () => {
    const osName = 'CentOS';
    const component = (
      <SystemsTableEmptyState osName={osName} osMajorVersion="9" />
    );
    const { container } = render(component);

    expect(queryByText(container, osName + ' 9')).not.toBeNull();
  });
});
