import { EditPolicySystems } from './EditPolicySystems.js';

describe('EditPolicySystems', () => {
    const defaultProps = {
        change: () => ({})
    };

    it('expect to render without error', async () => {
        const component = shallow(
            <EditPolicySystems
                { ...defaultProps }
                osMajorVersion="7"
                osMinorVersionCounts={ [] }
                selectedSystemIds={ [] } />
        );
        expect(toJson(component)).toMatchSnapshot();
    });
});
