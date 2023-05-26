import { policies } from '@/__fixtures__/policies';
import { filterHelpers } from 'Utilities/hooks/useTableTools/testHelpers.js';
import buildFilterConfig from './Filters';
import RulesTable from './RulesTable';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import useFeature from 'Utilities/hooks/useFeature';
jest.mock('Utilities/hooks/useFeature');

const mockStore = configureStore();
expect.extend(filterHelpers);

jest.mock(
  '@redhat-cloud-services/frontend-components-remediations/RemediationButton',
    () => (() => (<span>Button</span>))); // eslint-disable-line

describe('RulesTable', () => {
  let store;
  const profiles = policies.edges[0].node.policy.profiles.map((profile) => ({
    ...profile,
    profile,
  }));
  const defaultProps = {
    profileRules: profiles,
    system: {
      id: 1,
    },
  };

  beforeEach(() => {
    useFeature.mockImplementation(() => false);
    store = mockStore({});
  });

  it('expect to render without error', () => {
    let wrapper = shallow(<RulesTable {...defaultProps} />);
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
      showRuleStateFilter: false,
      ansibleSupportFilter: false,
    }).filter((filter) => filter.label !== 'Severity');

    const component = (
      <Provider store={store}>
        <RulesTable {...defaultProps} />
      </Provider>
    );

    expect(component).toHaveFiltersFor(filterConfig);
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
