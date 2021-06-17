import renderer from 'react-test-renderer';
import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  it('expect to render progress bar without error', () => {
    const component = renderer.create(<ProgressBar percent={0} />);

    expect(component.toJSON()).toMatchSnapshot();
  });

  it('expect to render failed bar without error', () => {
    const component = renderer.create(<ProgressBar percent={50} failed />);

    expect(component.toJSON()).toMatchSnapshot();
  });

  it('expect to render success bar without error', () => {
    const component = renderer.create(<ProgressBar percent={100} />);

    expect(component.toJSON()).toMatchSnapshot();
  });
});
