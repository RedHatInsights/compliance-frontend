import propTypes from 'prop-types';

export const Tab = ({ children }) => (children);

const TabSwitcher = (props) => (
    props.children.map((tab) => (
        tab.props.tabId === props.activeTab ? tab : undefined
    )).filter((c) => (!!c))
);

TabSwitcher.propTypes = {
    activeTab: propTypes.number,
    children: propTypes.node
};

export default TabSwitcher;
