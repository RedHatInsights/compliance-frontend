import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RemediationCell from './RemediationCell';

describe('RemediationCell', () => {
  it('expect to render "Manual" by default', () => {
    render(<RemediationCell />);

    expect(screen.getByText('Manual')).toBeInTheDocument();
  });

  it('expect to render "Automated"', () => {
    render(<RemediationCell hasPlaybook={true} />);

    expect(screen.getByText('Automated')).toBeInTheDocument();
  });
});
