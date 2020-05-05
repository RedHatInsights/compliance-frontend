import { BusinessObjectiveField } from './BusinessObjectiveField';
const businessObjective = {
    title: 'BO title',
    id: 1
};

const defaultProps = {
    businessObjective,
    client: {
        cache: {
            reset: jest.fn()
        },
        query: jest.fn(() => {
            return Promise.resolve({
                data: {
                    businessObjectives: [businessObjective]
                }
            });
        })
    },
    dispatch: jest.fn()
};

describe('BusinessObjectiveField', () => {
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

describe('BusinessObjectiveField.loadOptions', () => {
    it('expect to return options to consume', () => {
        const wrapper = shallow(
            <BusinessObjectiveField { ...defaultProps }/>
        );
        const instance = wrapper.instance();
        instance.loadOptions().then((result) => {
            return expect(result).toMatchSnapshot();
        });
    });
});

describe('BusinessObjectiveField.handleCreate', () => {
    it('expect to call dispatch', () => {
        const wrapper = shallow(
            <BusinessObjectiveField { ...defaultProps }/>
        );
        const instance = wrapper.instance();
        instance.handleCreate();
        expect(defaultProps.dispatch).toHaveBeenCalled();
    });
});
