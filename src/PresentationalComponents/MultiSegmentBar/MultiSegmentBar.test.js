import { render } from '@testing-library/react';
import MultiSegmentBar from './MultiSegmentBar';

const data = [
  {
    name: 'test1',
    color: '#fff',
    value: 5,
    label: 'test1',
  },
  {
    name: 'test2',
    color: '#000',
    value: 7,
    label: 'test2',
  },
];

describe('MultiSegmentBar', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(<MultiSegmentBar data={data} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
