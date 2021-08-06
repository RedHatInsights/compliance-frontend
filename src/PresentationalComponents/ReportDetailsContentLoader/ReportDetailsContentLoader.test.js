import ReportDetailsContentLoader from './ReportDetailsContentLoader';

describe('ReportDetailsContentLoader', () => {
  it('expect to render without error', () => {
    const wrapper = shallow(<ReportDetailsContentLoader />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
