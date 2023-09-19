import { render } from '@testing-library/react';
import { queryByText } from '@testing-library/dom';

import { GreySmallText } from './GreySmallText.js';

describe('GreySmallText', () => {
  it('expect to render without error', () => {
    const testText = 'THIS IS A TEST';
    const { container } = render(
      <GreySmallText>
        <span>{testText}</span>
      </GreySmallText>
    );

    expect(queryByText(container, testText)).not.toBeNull();
    expect(container.querySelector('small')).not.toBeNull();
  });
});
