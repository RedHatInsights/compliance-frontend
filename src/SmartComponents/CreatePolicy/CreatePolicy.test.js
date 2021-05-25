import { useQuery } from '@apollo/client';
import { benchmarksQuery } from '@/__fixtures__/benchmarks_rules.js';

jest.mock('@apollo/client');

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

    it('expect to render the wizard with enableNext on systems', () => {
        useQuery.mockImplementation(() => ({
            data: { latestBenchmarks: benchmarksQuery },
            error: false,
            loading: false
        }));
        const wrapper = shallow(
            <CreatePolicy systemIds={['123', '456']}/>
        );
        expect(wrapper.find('Wizard').prop('steps').find(({ name }) => name === 'Systems').enableNext).toMatchSnapshot();
    });
});
