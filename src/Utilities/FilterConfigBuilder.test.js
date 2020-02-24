import { FilterConfigBuilder } from './FilterConfigBuilder';
import { FILTER_CONFIGURATION } from '../constants';

describe('FilterConfigBuilder', () => {
    let builder;

    beforeEach(() => {
        builder = new FilterConfigBuilder(FILTER_CONFIGURATION);
    });

    it('returns a filterConfig', () => {
        const states = {
            name: '',
            compliant: [],
            compliancescore: []
        };
        const builtConfig = builder.buildConfiguration(FILTER_CONFIGURATION, ()=> ({}), states);

        expect(builtConfig).toMatchSnapshot();
    });
});
