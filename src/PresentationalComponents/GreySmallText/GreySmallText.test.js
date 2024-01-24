import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { GreySmallText } from './GreySmallText.js';

describe('GreySmallText', () => {
  it('expect to render without error', () => {
    const testText = 'THIS IS A TEST';
    render(<GreySmallText>{testText}</GreySmallText>);

    expect(screen.getByText(testText)).toBeInTheDocument();
  });
});
