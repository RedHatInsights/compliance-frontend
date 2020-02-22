import { buildFilterString } from './FilterBuilder';
import { pickBy } from 'lodash';

const filterKeys = (obj, keys) => (
    pickBy(obj, (_, key) => (keys.includes(key)))
);

describe('buildFilterString', () => {
    const exampleState = {
        policyId: 'exmpleID-1',
        activeFilters: {
            name: 'Name',
            compliant: [true],
            compliancescore: ['0-49', '50-69']
        }
    };

    it('returns a filterstring', () => {
        expect(buildFilterString(exampleState)).toMatchSnapshot();
    });

    it('returns a base filter for a policy id', () => {
        const testExampleState = filterKeys(exampleState, ['policyId']);
        expect(buildFilterString(testExampleState)).toMatchSnapshot();
    });

    describe('filter building', () => {
        it('returns a base filter for name when searching', () => {
            const testExampleState = {
                activeFilters: {
                    name: 'Name'
                }
            };
            expect(buildFilterString(testExampleState)).toMatchSnapshot();
        });

        it('returns a filter for complianceStates', () => {
            const testExampleState = {
                activeFilters: {
                    compliant: [true]
                }
            };
            expect(buildFilterString(testExampleState)).toMatchSnapshot();
        });

        it('returns a filter for complianceStates', () => {
            const testExampleState = {
                activeFilters: {
                    compliancescore: ['0-49', '50-69']
                }
            };
            expect(buildFilterString(testExampleState)).toMatchSnapshot();
        });
    });
});
