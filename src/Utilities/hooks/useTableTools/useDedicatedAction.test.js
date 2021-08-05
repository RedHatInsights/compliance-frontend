import { renderHook } from '@testing-library/react-hooks';
import useDedicatedAction from './useDedicatedAction';

describe('useDedicatedAction', () => {
    it('returns a dedicated action toolbar config using an element', () => {
        const { result } = renderHook(() => useDedicatedAction({
            dedicatedAction: <span>DEDICATED ACTION</span>,
            additionalDedicatedActions: [
                <span>ANOTHER DEDICATED ACTION</span>
            ]
        }));
        expect(result).toMatchSnapshot();
    });

    it('returns a dedicated action toolbar config using and passes selected items to a component', () => {
        const TestComponent = ({ selectedItems }) => (
            <span>{ selectedItems }</span>
        )
        const { result } = renderHook(() => useDedicatedAction({
            dedicatedAction: TestComponent,
            selectedItems: 'list of selected items',
            additionalDedicatedActions: [
                <span>ANOTHER DEDICATED ACTION</span>
            ]
        }));
        expect(result).toMatchSnapshot();
    });
});
