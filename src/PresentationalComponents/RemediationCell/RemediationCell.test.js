import { render } from '@testing-library/react';
import { queryByText } from '@testing-library/dom';
import RemediationCell from './RemediationCell';

describe('RemediationCell', () => {
  it('expect to render "Manual" by default', () => {
    const component = <RemediationCell />;
    const { container } = render(component);
    expect(queryByText(container, 'Manual')).toMatchSnapshot();
  });

  it('expect to render "Palybook"', () => {
    const component = <RemediationCell hasPlaybook={true} />;
    const { container } = render(component);
    expect(queryByText(container, 'Playbook')).toMatchSnapshot();
  });
});
