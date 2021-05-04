import { csvFromState, jsonFromState } from './Export.js';
import { tableState } from '@/__fixtures__/tablestate.js';

describe('csvFromState', () => {
    it('returns a CSV', () => {
        expect(csvFromState(tableState)).toMatchSnapshot();
    });
});

describe('jsonFromState', () => {
    it('returns a JSON', () => {
        expect(jsonFromState(tableState)).toMatchSnapshot();
    });
});
