import { render } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { Tab } from '@patternfly/react-core';
import TabSwitcher, {
  ContentTab,
  RoutedTabSwitcher,
  RoutedTabs,
} from './TabSwitcher';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({
    pathname: '/path/name',
    state: {},
  })),
}));

jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate',
  () => () => ({})
);

describe('TabSwitcher', () => {
  it('expect to render first tab', () => {
    const { asFragment } = render(
      <TabSwitcher activeKey="0">
        <Tab eventKey="0">First Tab</Tab>
        <Tab tabId="1">Second Tab</Tab>
      </TabSwitcher>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render second tab', () => {
    const { asFragment } = render(
      <TabSwitcher activeKey="1">
        <Tab eventKey="0">First Tab</Tab>
        <Tab eventKey="1">Second Tab</Tab>
      </TabSwitcher>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render second default tab', () => {
    const { asFragment } = render(
      <TabSwitcher defaultTab="1" activeKey="101">
        <Tab eventKey="0">First Tab</Tab>
        <Tab eventKey="1">Second Tab</Tab>
      </TabSwitcher>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render first as default tab', () => {
    const { asFragment } = render(
      <TabSwitcher activeKey="101">
        <Tab eventKey="0">First Tab</Tab>
        <Tab eventKey="1">Second Tab</Tab>
      </TabSwitcher>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('RoutedTabSwitcher', () => {
  it('expect to set systems as activeKey', () => {
    useLocation.mockImplementation(() => ({
      hash: '#system',
      path: '/current/location',
    }));
    const { asFragment } = render(
      <RoutedTabSwitcher defaultTab="details">
        <ContentTab eventKey="details">DETAILS</ContentTab>
        <ContentTab eventKey="rules">RULES</ContentTab>
        <ContentTab eventKey="systems">SYSTEMS</ContentTab>
      </RoutedTabSwitcher>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to set 1 as active tab', () => {
    useLocation.mockImplementation(() => ({
      hash: '#1',
      path: '/current/location',
    }));
    const { asFragment } = render(
      <RoutedTabSwitcher defaultTab="0">
        <Tab eventKey="0">First Tab</Tab>
        <Tab eventKey="1">Second Tab</Tab>
      </RoutedTabSwitcher>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('RoutedTabs', () => {
  it('expect to render first tab', () => {
    const { asFragment } = render(
      <RoutedTabs defaultTab="rules">
        <Tab title="Details" id="policy-details" eventKey="details" />
        <Tab title="Rules" id="policy-rules" eventKey="rules" />
        <Tab title="Systems" id="policy-systems" eventKey="systems" />
      </RoutedTabs>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render second tab', () => {
    const { asFragment } = render(
      <RoutedTabs activeKey="systems" defaultTab="rules">
        <Tab title="Details" id="policy-details" eventKey="details" />
        <Tab title="Rules" id="policy-rules" eventKey="rules" />
        <Tab title="Systems" id="policy-systems" eventKey="systems" />
      </RoutedTabs>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
