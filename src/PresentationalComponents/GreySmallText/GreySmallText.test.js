import { render } from '@testing-library/react';
import { GreySmallText } from './GreySmallText.js';

describe('GreySmallText', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(
      <GreySmallText>
        <span>THIS IS A TEST</span>
      </GreySmallText>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
