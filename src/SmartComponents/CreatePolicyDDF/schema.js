import { componentTypes } from '@data-driven-forms/react-form-renderer';

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
            },
            // Hidden field - custom components don't auto-register with React Final Form validation
            {
              component: componentTypes.TEXT_FIELD,
              name: 'scap-policy-selection-validation',
              hideField: true,
              validate: [
                (value) =>
                  value !== 'valid'
                    ? 'Profile selection validation failed'
                    : undefined,
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
            },
            // Hidden field - custom components don't auto-register with React Final Form validation
            {
              component: componentTypes.TEXT_FIELD,
              name: 'details-validation',
              hideField: true,
              validate: [
                (value) =>
                  value !== 'valid'
                    ? 'Policy name validation pending or failed'
                    : undefined,
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
            },
            // Hidden field - custom components don't auto-register with React Final Form validation
            {
              component: componentTypes.TEXT_FIELD,
              name: 'rules-validation',
              hideField: true,
              validate: [
                (value) =>
                  value !== 'valid'
                    ? 'Rules selection validation failed'
                    : undefined,
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
