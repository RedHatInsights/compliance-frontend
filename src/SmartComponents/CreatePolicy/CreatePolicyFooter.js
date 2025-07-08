import { Button, ButtonVariant, Flex } from '@patternfly/react-core';
import {
  WizardContextConsumer,
  WizardFooter,
} from '@patternfly/react-core/deprecated';
import React from 'react';

const CreatePolicyFooter = () => (
  <WizardFooter>
    <WizardContextConsumer>
      {({ onNext, onBack, onClose, activeStep }) => {
        const stepNameEdited = activeStep.name
          .toLowerCase()
          .replaceAll(' ', '-');

        return (
          <Flex columnGap={{ default: 'columnGapSm' }}>
            <Button
              id={`${stepNameEdited}-next-button`}
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
                id={`${stepNameEdited}-back-button`}
                variant={ButtonVariant.secondary}
                onClick={onBack}
                isDisabled={activeStep.id === 1}
              >
                {activeStep.backButtonText || 'Back'}
              </Button>
            )}
            {!activeStep.hideCancelButton && (
              <Button
                id={`${stepNameEdited}-cancel-button`}
                variant={ButtonVariant.link}
                onClick={onClose}
              >
                {activeStep.cancelButtonText || 'Cancel'}
              </Button>
            )}
          </Flex>
        );
      }}
    </WizardContextConsumer>
  </WizardFooter>
);

export default CreatePolicyFooter;
