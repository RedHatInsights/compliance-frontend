import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { makeStepValidityValidator } from './validate';

const schema = {
  fields: [
    {
      component: componentTypes.WIZARD,
      name: 'create-policy-wizard',
      isDynamic: true,
      inModal: true,
      title: 'Create SCAP policy',
      description: 'Create a new policy for managing SCAP compliance',
      buttonLabels: {
        submit: 'Finish',
      },
      fields: [
        {
          name: 'step-create-scap-policy',
          title: 'Create SCAP policy',
          nextStep: 'step-details',
          fields: [
            {
              component: 'create-scap-policy-step',
              name: 'scap-policy-selection',
              validate: [
                makeStepValidityValidator(
                  'Profile selection validation failed',
                ),
              ],
            },
          ],
        },
        {
          name: 'step-details',
          title: 'Details',
          nextStep: 'step-systems',
          fields: [
            {
              component: 'details-step',
              name: 'details-content',
              validate: [
                makeStepValidityValidator(
                  'Policy name validation pending or failed',
                ),
              ],
            },
          ],
        },
        {
          name: 'step-systems',
          title: 'Systems',
          nextStep: 'step-rules',
          fields: [
            {
              component: 'systems-step',
              name: 'systems-table',
            },
          ],
        },
        {
          name: 'step-rules',
          title: 'Rules',
          nextStep: 'step-review',
          fields: [
            {
              component: 'rules-step',
              name: 'rules-content',
              validate: [
                makeStepValidityValidator('Rules selection validation failed'),
              ],
            },
          ],
        },
        {
          name: 'step-review',
          title: 'Review',
          nextStep: 'step-finished',
          fields: [
            {
              component: 'review-step',
              name: 'review-intro',
              label: 'Review your SCAP policy before finishing.',
            },
          ],
        },
        {
          name: 'step-finished',
          isProgressAfterSubmissionStep: true,
          fields: [
            {
              component: 'finished-step',
              name: 'finished-content',
            },
          ],
        },
      ],
    },
  ],
};

export default schema;
