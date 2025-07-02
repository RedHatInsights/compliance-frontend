import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import TopFailedRulesSection from './TopFailedRulesSection';
import { capitalizeWord, stringToSentenceCase } from '@/Utilities/helpers';

describe('TopFailedRulesSection', () => {
  const mockRulesData = [
    {
      identifier: { label: 'CCE-1' },
      title: 'rule',
      severity: 'critical',
      count: 10,
    },
    {
      identifier: { label: 'CCE-2' },
      title: 'another rule',
      severity: 'unknown',
      count: 5,
    },
    {
      identifier: { label: 'CCE-3' },
      title: 'third rule',
      severity: 'low',
      count: 2,
    },
  ];

  it('renders no table rows when rulesData is empty', () => {
    render(<TopFailedRulesSection rulesData={[]} />);
    const rows = screen.queryAllByRole('row');
    expect(rows).toHaveLength(1);
  });

  it('renders the correct number of rows based on rulesData', () => {
    render(<TopFailedRulesSection rulesData={mockRulesData} />);
    expect(screen.getByText('Top failed rules')).toBeInTheDocument();

    expect(screen.getAllByRole('row')).toHaveLength(mockRulesData.length + 1);
    mockRulesData.forEach((rule) => {
      expect(screen.getByText(rule.identifier.label)).toBeInTheDocument();
      expect(
        screen.getByText(stringToSentenceCase(rule.title)),
      ).toBeInTheDocument();
      expect(
        screen.getByText(capitalizeWord(rule.severity)),
      ).toBeInTheDocument();
      expect(screen.getByText(rule.count)).toBeInTheDocument();
    });
  });
});
