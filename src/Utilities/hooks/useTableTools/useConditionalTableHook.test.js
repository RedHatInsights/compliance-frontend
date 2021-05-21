import { renderHook } from '@testing-library/react-hooks';
import useConditionalTableHook from './useConditionalTableHook';

describe('useConditionalTableHook', () => {
    it('returns a hook on condition', () => {
        const mockHook = jest.fn();
        const { result } = renderHook(() => useConditionalTableHook(true, mockHook, {}));
        expect(mockHook).toHaveBeenCalled();
        expect(result).toMatchSnapshot();
    });
});
