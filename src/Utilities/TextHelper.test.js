import { lastScanned } from './TextHelper';

describe('.lastScanned', () => {
    it('should find the latest scan date', () => {
        const dates = [
            new Date('2019-10-25T15:59:49Z'),
            new Date('2019-10-23T15:59:49Z'),
            new Date('2018-12-23T17:59:49Z')
        ];
        expect(lastScanned(dates)).toEqual(new Date('2019-10-25T15:59:49Z'));
    });

    it('should print the latest scan date even if one profile was never scanned', () => {
        const dates = [
            new Date('2019-10-25T15:59:49Z'),
            'Never'
        ];
        expect(lastScanned(dates)).toEqual(new Date('2019-10-25T15:59:49Z'));
    });

    it('should print Never if the scan date cannot be ascertained', () => {
        expect(lastScanned([])).toEqual('Never');
        expect(lastScanned(['Never'])).toEqual('Never');
    });
});
