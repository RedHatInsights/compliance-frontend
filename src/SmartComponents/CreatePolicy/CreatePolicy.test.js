import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { init } from 'Store';
import TestWrapper from '@/Utilities/TestWrapper';
import graphqlQueryMocks from './__mocks__/graphqlQueryMocks';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';

import CreatePolicy from './CreatePolicy';

jest.mock('../../Utilities/hooks/useAPIV2FeatureFlag');

const store = init().getStore();

const dispatchFieldChange = (store, field, payload) =>
  store.dispatch({
    type: '@@redux-form/CHANGE',
    meta: {
      form: 'policyForm',
      field,
    },
    payload,
  });

const checkStep = async (name, stepTests) => {
  expect(screen.getByRole('heading', { name })).toBeInTheDocument();

  stepTests && (await stepTests());
};

const nextStep = async (name, stepTests) => {
  await userEvent.click(
    screen.getByRole('button', { name: 'Next', enabled: true })
  );
  await checkStep(name, stepTests);
};

describe('CreatePolicy', () => {
  beforeEach(() => {
    useAPIV2FeatureFlag.mockImplementation(() => false);
  });
  it('expect to render the Create Policy wizard', async () => {
    const {
      mocks,
      osMajorVersionToSelect,
      profileToSelect,
      randomSystems,
      randomSystemsCounts,
    } = graphqlQueryMocks(['7']);

    render(
      <TestWrapper mocks={mocks} store={store}>
        <CreatePolicy />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();

    await checkStep('Create SCAP policy', async () => {
      await screen.findByText('Operating system');
      await userEvent.click(
        screen.getByRole('option', {
          name: 'RHEL ' + osMajorVersionToSelect.osMajorVersion,
        })
      );

      expect(screen.getByText('Policy type')).toBeInTheDocument();

      await userEvent.type(
        // TODO Figure out how to set aria-label on filter input
        screen.getByRole('textbox', { name: 'text input' }),
        profileToSelect.name
      );

      await userEvent.click(
        screen.getByRole('radio', { name: 'Select row 0' })
      );
    });

    await nextStep('Details', async () => {
      expect(screen.getByText('Policy name')).toBeInTheDocument();
    });

    await nextStep('Systems', async () => {
      // Since we mock InventoryTable we need to dispatch a change manually
      dispatchFieldChange(store, 'systems', randomSystems);
      dispatchFieldChange(store, 'osMinorVersionCounts', randomSystemsCounts);
    });
    // TODO add proper rules data
    //     await nextStep('Rules', async () => {
    //       expect(screen.getByText(profileToSelect.name)).toBeInTheDocument();
    //
    //       await screen.findByText('SSG version');
    //
    //       profileToSelect.supportedOsVersions.forEach(async (osMinorVersion) => {
    //         expect(
    //           screen.getByRole('tabpanel', {
    //             name:
    //               'Rules for RHEL ' + osMajorVersionToSelect + '.' + osMinorVersion,
    //           })
    //         ).toBeInTheDocument();
    //       });
    //     });
  });
});
