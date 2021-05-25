import { FinishedCreatePolicy } from './FinishedCreatePolicy.js';
import { usePolicy } from 'Mutations';
jest.mock('Mutations');

describe('FinishedCreatePolicy', () => {
    const defaultProps = {
        client: {},
        benchmarkId: 'BENCH_ID',
        businessObjective: {},
        cloneFromProfileId: 'CLONE_ID',
        refId: 'REF_ID',
        name: 'NAME',
        description: 'DESCRIPTION',
        complianceThreshold: 50,
        systemIds: [],
        selectedRuleRefIds: []
    };

    it('expect to render without error', () => {
        usePolicy.mockImplementation(() => (() => (Promise.resolve({}))));
        const onClose = () => {};

        const wrapper = shallow(
            <FinishedCreatePolicy { ...defaultProps } onClose={onClose} />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it.skip('expect to render finished error state', () => {
        usePolicy.mockImplementation(() => (
            () => (Promise.reject(new Error('ERRORR')))
        ));
        const onClose = () => {};

        const wrapper = shallow(
            <FinishedCreatePolicy { ...defaultProps } onClose={onClose} />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
