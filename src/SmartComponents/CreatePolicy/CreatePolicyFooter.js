import {
  Button,
  ButtonVariant,
  WizardContextConsumer,
  WizardFooter,
} from '@patternfly/react-core';
import React from 'react';

const CreatePolicyFooter = () => (
  <WizardFooter>
    <WizardContextConsumer>
      {({ onNext, onBack, onClose, activeStep }) => (
        <>
          <Button
            variant={ButtonVariant.primary}
            type="submit"
            onClick={onNext}
            isDisabled={
              !(activeStep && activeStep.enableNext !== undefined
                ? activeStep.enableNext
                : true)
            }
          >
            {activeStep.nextButtonText || 'Next'}
          </Button>
          {!activeStep.hideBackButton && (
            <Button
              variant={ButtonVariant.secondary}
              onClick={onBack}
              isDisabled={activeStep.id === 1}
            >
              {activeStep.backButtonText || 'Back'}
            </Button>
          )}
          {!activeStep.hideCancelButton && (
            <div className="pf-c-wizard__footer-cancel">
              <Button variant={ButtonVariant.link} onClick={onClose}>
                {activeStep.cancelButtonText || 'Cancel'}
              </Button>
            </div>
          )}
        </>
      )}
    </WizardContextConsumer>
  </WizardFooter>
);

export default CreatePolicyFooter;
