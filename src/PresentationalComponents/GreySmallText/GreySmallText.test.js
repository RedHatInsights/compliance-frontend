import { GreySmallText } from './GreySmallText.js';

describe('GreySmallText', () => {
  it('expect to render without error', () => {
    let wrapper = shallow(
      <GreySmallText>
        <span>THIS IS A TEST</span>
      </GreySmallText>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
