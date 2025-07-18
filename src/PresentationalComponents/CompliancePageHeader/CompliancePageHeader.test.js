import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CompliancePageHeader from './CompliancePageHeader';

describe('CompliancePageHeader', () => {
  const mockMainTitle = 'My Compliance Policy';
  const mockPopoverData = {
    headerContent: 'About My Compliance Policy',
    bodyContent:
      'This policy helps ensure your systems meet specific compliance requirements.',
    bodyLink: 'https://docs.example.com/compliance-policy',
  };

  test('renders the main title correctly', () => {
    render(
      <CompliancePageHeader
        mainTitle={mockMainTitle}
        popoverData={mockPopoverData}
      />,
    );

    expect(screen.getByText(mockMainTitle)).toBeInTheDocument();
  });

  test('opens and displays popover content on icon click', async () => {
    render(
      <CompliancePageHeader
        mainTitle={mockMainTitle}
        popoverData={mockPopoverData}
      />,
    );

    const questionIcon = screen.getByTestId('compliance-header-popover-icon');
    await userEvent.click(questionIcon);

    expect(screen.getByText(mockPopoverData.headerContent)).toBeVisible();
    expect(screen.getByText(mockPopoverData.bodyContent)).toBeVisible();
    const learnMoreLink = screen.getByRole('link', { name: /learn more/i });
    expect(learnMoreLink).toBeVisible();
  });
});
