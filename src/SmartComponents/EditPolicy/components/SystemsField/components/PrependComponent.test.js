import { render } from '@testing-library/react';
import { queryByText } from '@testing-library/dom';
import PrependComponent from './PrependComponent';

describe('PrependComponent', () => {
  it('expected to render', () => {
    const component = <PrependComponent osMajorVersion="7" />;
    const { container } = render(component);

    expect(queryByText(container, 'RHEL 7')).not.toBeNull();
  });

  it('expected to render with differenc os version', () => {
    const component = <PrependComponent osMajorVersion="9" />;
    const { container } = render(component);

    expect(queryByText(container, 'RHEL 9')).not.toBeNull();
  });
});
