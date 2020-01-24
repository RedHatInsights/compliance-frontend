import toJson from 'enzyme-to-json';

import { BusinessObjectiveField } from './BusinessObjectiveField';

describe('BusinessObjectiveField', () => {
    const defaultProps = {
        businessObjective: {
            title: 'BO title',
            id: 1
        }
    };

    it('expect to render without error', () => {
        const wrapper = shallow(
            <BusinessObjectiveField { ...defaultProps }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render without title', () => {
        const wrapper = shallow(
            <BusinessObjectiveField showTitle={false} { ...defaultProps }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
