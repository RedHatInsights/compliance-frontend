import ComplianceScore from './ComplianceScore';
import renderer from 'react-test-renderer';

describe('auxiliary functions to reducer', () => {
    it('should show a danger icon if the host is not compliant in any profile', () => {
        const system = {
            rulesPassed: 30,
            rulesFailed: 300,
            profiles: [
                { compliant: false },
                { compliant: false }
            ]
        };

        const dangerIcon = renderer.create(ComplianceScore(system)).toJSON();
        expect(dangerIcon).toMatchSnapshot();
    });

    it('should show a danger icon if the host is not compliant in some profile', () => {
        const system = {
            rulesPassed: 30,
            rulesFailed: 3,
            profiles: [
                { compliant: true },
                { compliant: false }
            ]
        };

        const dangerIcon = renderer.create(ComplianceScore(system)).toJSON();
        expect(dangerIcon).toMatchSnapshot();
    });

    it('should show a success icon if the host is compliant in all profiles', () => {
        const system = {
            rulesPassed: 30,
            rulesFailed: 3,
            profiles: [
                { compliant: true },
                { compliant: true }
            ]
        };

        const checkIcon = renderer.create(ComplianceScore(system)).toJSON();
        expect(checkIcon).toMatchSnapshot();
    });

    it('should show a question mark icon if the host has no rules passed or failed', () => {
        const system = {
            rulesPassed: 0,
            rulesFailed: 0
        };

        const questionMarkIcon = renderer.create(ComplianceScore(system)).toJSON();
        expect(questionMarkIcon).toMatchSnapshot();
    });
});
