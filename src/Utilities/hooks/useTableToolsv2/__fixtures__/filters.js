export const exampleFilters = [
  {
    type: 'text',
    label: 'Name',
  },
  {
    type: 'checkbox',
    label: 'Compliant',
    items: [
      { label: 'Compliant', value: 'true' },
      { label: 'Non-compliant', value: 'false' },
    ],
  },
  {
    type: 'checkbox',
    label: 'Systems meeting compliance',
    items: [
      { label: '90 - 100%', value: '90-100' },
      { label: '70 - 89%', value: '70-89' },
      { label: '50 - 69%', value: '50-69' },
      { label: 'Less than 50%', value: '0-49' },
    ],
  },
];

export default [
  {
    type: 'text',
    label: 'Name',
  },
  {
    type: 'hidden',
    label: 'Hidden filter',
  },
  {
    type: 'checkbox',
    label: 'Checkbox Filter',
    items: ['OPTION 1', 'OPTION 2', 'OPTION 3'].map((option) => ({
      label: option,
      value: `${option}-value`,
    })),
  },
  {
    type: 'radio',
    label: 'Radio Filter',
    items: ['OPTION 1', 'OPTION 2', 'OPTION 3'].map((option) => ({
      label: option,
      value: `${option}-value`,
    })),
  },
  {
    type: 'UNKNOWNTYPE',
    label: 'Invalid Filter',
    items: ['OPTION 1', 'OPTION 2', 'OPTION 3'].map((option) => ({
      label: option,
      value: `${option}-value`,
    })),
  },
  {
    type: 'group',
    label: 'Filter group',
    groupSelectable: true,
    items: [
      {
        label: 'Parent 1',
        value: 1,
        items: [
          { label: 'Child 1', value: 1 },
          { label: 'Child 2', value: 2 },
        ],
      },
      {
        label: 'Parent 2',
        value: 2,
        items: [
          { label: 'Parent 2 Child 1', value: 1 },
          { label: 'Parent 2 Child 2', value: 2 },
        ],
      },
    ],
  },
];
