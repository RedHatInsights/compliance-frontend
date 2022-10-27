import { filterHelpers } from 'Utilities/hooks/useTableTools/testHelpers.js';
expect.extend(filterHelpers);

import { policies } from '@/__fixtures__/policies';
import buildSystems from '@/__factories__/systems';

import buildFilterConfig from './Filters';
import RulesTable from './RulesTable';

// eslint-disable-next-line react/display-name,react/prop-types
jest.mock('PresentationalComponents/ComplianceRemediationButton', () => () => (
  <span>Button</span>
));

describe('RulesTable', () => {
  const profiles = policies.edges[0].node.policy.profiles.map((profile) => ({
    ...profile,
    profile,
  }));
  const defaultProps = {
    profileRules: profiles,
    system: buildSystems()[0],
  };

  it('expect to render without error', () => {
    const wrapper = shallow(<RulesTable {...defaultProps} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('expect to pass on options', () => {
    let wrapper = shallow(
      <RulesTable
        {...{
          ...defaultProps,
          options: {
            additionalTableToolsOption: true,
          },
        }}
      />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('expect to have filters properly rendered', () => {
    const filterConfig = buildFilterConfig({
      showPassFailFilter: false,
      ansibleSupportFilter: false,
    }).filter((filter) => filter.label !== 'Severity');

    expect(<RulesTable {...defaultProps} />).toHaveFiltersFor(filterConfig);
  });

  it('expect to pass dedicatedAction', () => {
    const dedicatedAction = () => <span>Dedicated Action</span>;
    let wrapper = shallow(
      <RulesTable
        {...{
          ...defaultProps,
          remediationsEnabled: false,
          options: {
            dedicatedAction,
          },
        }}
      />
    );

    expect(wrapper.props().options.dedicatedAction).toBe(dedicatedAction);
  });
});
