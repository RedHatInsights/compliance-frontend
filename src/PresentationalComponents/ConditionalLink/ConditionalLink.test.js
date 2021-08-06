import ConditionalLink from './ConditionalLink';

describe('ConditionalLink', () => {
  it('expect to render without error', () => {
    const wrapper = shallow(<ConditionalLink href="https://redhat.com" />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('expect to render without error and children', () => {
    const wrapper = shallow(
      <ConditionalLink href="https://redhat.com">
        <span>Test Child</span>
      </ConditionalLink>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
