import { WizardContextProvider } from '@patternfly/react-core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePolicyFooter from './CreatePolicyFooter';

describe('CreatePolicyFooter', () => {
  const onNext = jest.fn();
  const onBack = jest.fn();
  const onClose = jest.fn();

  const context = {
    goToStepById: jest.fn(),
    goToStepByName: jest.fn(),
    onNext,
    onBack,
    onClose,
    activeStep: { name: 'test' },
  };

  it('matches snapshot', () => {
    const view = render(
      <WizardContextProvider value={context}>
        <CreatePolicyFooter />
      </WizardContextProvider>
    );

    expect(view.asFragment()).toMatchSnapshot();
  });

  it('can navigate next', async () => {
    render(
      <WizardContextProvider value={context}>
        <CreatePolicyFooter />
      </WizardContextProvider>
    );

    await userEvent.click(
      screen.getByRole('button', {
        name: /next/i,
      })
    );
    expect(onNext).toHaveBeenCalled();
  });

  it('can navigate back', async () => {
    render(
      <WizardContextProvider value={context}>
        <CreatePolicyFooter />
      </WizardContextProvider>
    );

    await userEvent.click(
      screen.getByRole('button', {
        name: /back/i,
      })
    );
    expect(onBack).toHaveBeenCalled();
  });

  it('can close/cancel', async () => {
    render(
      <WizardContextProvider value={context}>
        <CreatePolicyFooter />
      </WizardContextProvider>
    );

    await userEvent.click(
      screen.getByRole('button', {
        name: /cancel/i,
      })
    );
    expect(onClose).toHaveBeenCalled();
  });
});
