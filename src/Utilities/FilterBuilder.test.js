import { buildFilterString } from './FilterBuilder';
import { pickBy } from 'lodash';

const filterKeys = (obj, keys) => (
    pickBy(obj, (_, key) => (keys.includes(key)))
);

describe('buildFilterString', () => {
    const exampleState = {
        policyId: 'exmpleID-1',
        search: 'Policy Name',
        activeFilters: {
            complianceStates: [true],
            complianceScores: ['0-49', '50-69']
        }
    };

    it('returns a filterstring', () => {
        expect(buildFilterString(exampleState)).toMatchSnapshot();
    });

    it('returns a base filter for a policy id', () => {
        const testExampleState = filterKeys(exampleState, ['policyId']);
        expect(buildFilterString(testExampleState)).toMatchSnapshot();
    });

    it('returns a base filter for name when searching', () => {
        const testExampleState = filterKeys(exampleState, ['search']);
        expect(buildFilterString(testExampleState)).toMatchSnapshot();
    });

    describe('compliance state and score filter', () => {
        it('returns a filter for complianceStates', () => {
            const testExampleState = {
                activeFilters: {
                    complianceStates: [true]
                }
            };
            expect(buildFilterString(testExampleState)).toMatchSnapshot();
        });

        it('returns a filter for complianceStates', () => {
            const testExampleState = {
                activeFilters: {
                    complianceScores: ['0-49', '50-69']
                }
            };
            expect(buildFilterString(testExampleState)).toMatchSnapshot();
        });
    });
});
