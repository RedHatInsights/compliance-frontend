import toJson from 'enzyme-to-json';

import { DownloadTableButton } from './DownloadTableButton.js';

describe('DownloadTableButton', () => {
    const defaultProps = {
        exportToCSV: jest.fn(),
        selectedEntities: [1, 2, 3]
    };

    it('expect to render without error', () => {
        const wrapper = shallow(
            <DownloadTableButton { ...defaultProps }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
