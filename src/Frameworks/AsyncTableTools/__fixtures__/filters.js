export const exampleFilters = [
  {
    type: 'text',
    label: 'Name',
    filterString: (value) => `name ~ "${value}"`,
  },
  {
    type: 'checkbox',
    label: 'Compliance',
    filterString: (value) => `compliant = ${value}`,
    items: [
      { label: 'Compliant', value: 'true' },
      { label: 'Non-compliant', value: 'false' },
    ],
  },
  {
    type: 'checkbox',
    label: 'Systems meeting compliance',
    filterString: (value) => {
      const scoreRange = value.split('-');
      return `(percent_compliant >= ${scoreRange[0]} AND percent_compliant <= ${scoreRange[1]})`;
    },
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
    filterAttribute: 'name',
    filter: (items, value) =>
      items.filter((item) => item?.name.includes(value)),
  },
  {
    type: 'hidden',
    label: 'Hidden filter',
    filter: (items) => items,
  },
  {
    type: 'checkbox',
    label: 'Checkbox Filter',
    filterAttribute: 'checkbox',
    items: ['OPTION 1', 'OPTION 2', 'OPTION 3'].map((option) => ({
      label: option,
      value: `${option}-value`,
    })),
    filter: (items) => items,
  },
  {
    type: 'radio',
    label: 'Radio Filter',
    filterAttribute: 'radio',
    items: ['OPTION 1', 'OPTION 2', 'OPTION 3'].map((option) => ({
      label: option,
      value: `${option}-value`,
    })),
    filter: (items) => items,
  },
  {
    type: 'UNKNOWNTYPE',
    label: 'Invalid Filter',
    items: ['OPTION 1', 'OPTION 2', 'OPTION 3'].map((option) => ({
      label: option,
      value: `${option}-value`,
    })),
    filter: (items) => items,
  },
  {
    type: 'group',
    label: 'Filter group',
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
    filter: () => [],
  },
];
