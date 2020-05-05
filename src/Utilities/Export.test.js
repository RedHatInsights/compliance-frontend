import { csvFromState } from './Export.js';
import { tableState } from '@/__fixtures__/tablestate.js';

describe('csvFromState', () => {
    it('returns a CSV', () => {
        expect(csvFromState(tableState)).toMatchSnapshot();
    });
});
