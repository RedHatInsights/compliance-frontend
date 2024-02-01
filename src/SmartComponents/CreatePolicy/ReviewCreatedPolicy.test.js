import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestWrapper from '@/Utilities/TestWrapper';

import ReviewCreatedPolicy from './ReviewCreatedPolicy.js';
import configureStore from 'redux-mock-store';
import { policyFormValues } from '@/__fixtures__/benchmarks_rules.js';

const mockStore = configureStore();

describe('ReviewCreatedPolicy', () => {
  it('expect to render without error', () => {
    const store = mockStore({
      form: {
        policyForm: {
          values: {
            osMinorVersionCounts: [
              {
                osMinorVersion: 7,
                count: 10,
              },
              {
                osMinorVersion: 5,
                count: 3,
              },
            ],
            ...policyFormValues,
          },
        },
      },
      entities: {
        systems: [
          {
            node: {
              osMinorVersion: 2,
            },
          },
          {
            node: {
              osMinorVersion: 1,
            },
          },
          {
            node: {
              osMinorVersion: 1,
            },
          },
        ],
      },
    });
    render(
      <TestWrapper store={store}>
        <ReviewCreatedPolicy osMajorVersion={'7'} />
      </TestWrapper>
    );

    expect(
      screen.getByRole('heading', {
        name: 'C2S for Red Hat Enterprise Linux 6',
      })
    ).toBeInTheDocument();
  });
});
