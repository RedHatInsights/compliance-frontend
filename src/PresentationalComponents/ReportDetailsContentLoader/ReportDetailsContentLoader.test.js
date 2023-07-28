import { render } from '@testing-library/react';
import ReportDetailsContentLoader from './ReportDetailsContentLoader';

describe('ReportDetailsContentLoader', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(<ReportDetailsContentLoader />);

    expect(asFragment()).toMatchSnapshot();
  });
});
