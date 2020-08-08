import { useQuery } from '@apollo/react-hooks';
import { benchmarksQuery } from '@/__fixtures__/benchmarks_rules.js';

jest.mock('@apollo/react-hooks');

import { CreatePolicy } from './CreatePolicy.js';

describe('CreatePolicy', () => {
    it('expect to render the wizard', () => {
        useQuery.mockImplementation(() => ({
            data: { latestBenchmarks: benchmarksQuery },
            error: false,
            loading: false
        }));
        const wrapper = shallow(
            <CreatePolicy />
        );
        expect(toJson(wrapper.find('Wizard'))).toMatchSnapshot();
    });
});
