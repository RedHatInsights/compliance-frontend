import { csvFromState, jsonFromState } from './Export.js';
import { tableState } from '@/__fixtures__/tablestate.js';

describe('csvFromState', () => {
    it('returns a CSV', () => {
        expect(csvFromState(tableState)).toMatchSnapshot();
    });

    it('returns a CSV', () => {
        const tableStateWithSelected = {
            ...tableState,
            selectedEntities: [tableState.rows[0]]
        };

        expect(csvFromState(tableStateWithSelected)).toMatchSnapshot();
    });
});

describe('jsonFromState', () => {
    it('returns a JSON', () => {
        expect(jsonFromState(tableState)).toMatchSnapshot();
    });

    it('returns a JSON', () => {
        const tableStateWithSelected = {
            ...tableState,
            selectedEntities: [tableState.rows[tableState.rows.length - 1]]
        };

        expect(jsonFromState(tableStateWithSelected)).toMatchSnapshot();
    });
});
