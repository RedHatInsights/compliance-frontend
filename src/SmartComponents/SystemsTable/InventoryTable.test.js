import { InventoryTable } from './InventoryTable';

jest.mock('@apollo/client', () => ({
    ...jest.requireActual('react-redux'),
    useApolloClient: () => (
        jest.fn()
    )
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => (
        jest.fn()
    ),
    useStore: jest.fn(() => ({
        getStore: jest.fn({})
    }))
}));

describe('InventoryTable', () => {
    it('returns', () => {
        expect(renderJson(
            <InventoryTable />
        )).toMatchSnapshot();
    });

    it('returns without actions', () => {
        expect(renderJson(
            <InventoryTable showActions={ false } />
        )).toMatchSnapshot();
    });

    it('returns without remediations', () => {
        expect(renderJson(
            <InventoryTable remediationsEnabled={ false } />
        )).toMatchSnapshot();
    });

    it('returns showAllSystems', () => {
        expect(renderJson(
            <InventoryTable showAllSystems />
        )).toMatchSnapshot();
    });

    it('returns with a showComplianceSystemsInfo', () => {
        expect(renderJson(
            <InventoryTable showComplianceSystemsInfo />
        )).toMatchSnapshot();
    });

    it('returns compact', () => {
        expect(renderJson(
            <InventoryTable compact />
        )).toMatchSnapshot();
    });

    it('returns with compliantFilter', () => {
        expect(renderJson(
            <InventoryTable compliantFilter />
        )).toMatchSnapshot();
    });

    it('returns with showOnlySystemsWithTestResults', () => {
        expect(renderJson(
            <InventoryTable showOnlySystemsWithTestResults />
        )).toMatchSnapshot();
    });
});
