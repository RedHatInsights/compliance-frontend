import { csvFromState } from './Export.js';
import { tableState } from './fixtures.js';

describe('csvFromState', () => {
    it('returns a CSV', () => {
        expect(csvFromState(tableState)).toMatchSnapshot();
    });
});
