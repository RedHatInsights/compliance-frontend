import React from 'react';
import { QuestionCircleIcon, CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { compliantIcon, rulesCount, lastScanned } from './SystemStore';

describe('SystemsStore:', () => {
    it('should set rules count as the sum over all profiles', () => {
        const system = {
            profiles: [
                { rulesPassed: 3, rulesFailed: 1 },
                { rulesPassed: 10, rulesFailed: 3 }
            ]
        };
        expect(rulesCount(system, 'rulesPassed')).toEqual(13);
        expect(rulesCount(system, 'rulesFailed')).toEqual(4);
    });

    it('should set rules count even if profiles is an empty array', () => {
        const system = { profiles: [] };
        expect(rulesCount(system, 'rulesPassed')).toEqual(0);
        expect(rulesCount(system, 'rulesFailed')).toEqual(0);
    });

    it('should find the latest scan date', () => {
        const system = {
            profiles: [
                { lastScanned: '2019-10-25T15:59:49Z' },
                { lastScanned: '2019-10-23T15:59:49Z' },
                { lastScanned: '2018-12-23T17:59:49Z' }
            ]
        };
        expect(lastScanned(system)).toEqual(new Date('2019-10-25T15:59:49Z'));
    });

    it('should print the latest scan date even if one profile was never scanned', () => {
        const system = {
            profiles: [
                { lastScanned: '2019-10-25T15:59:49Z' },
                { lastScanned: 'Never' }
            ]
        };
        expect(lastScanned(system)).toEqual(new Date('2019-10-25T15:59:49Z'));
    });

    it('should print Never if the scan date cannot be ascertained', () => {
        expect(lastScanned({ profiles: [] })).toEqual('Never');
        expect(lastScanned({ profiles: [{ lastScanned: 'Never' }] })).toEqual('Never');
    });

    it('should show a danger icon if the host is not compliant in any profile', () => {
        const system = {
            rulesPassed: 30,
            rulesFailed: 300,
            profiles: [
                { compliant: false },
                { compliant: false }
            ]
        };

        expect(compliantIcon(system)).toEqual(
            <React.Fragment>
                <ExclamationCircleIcon color='currentColor' noVerticalAlign={false} size='sm'
                    style={ { color: 'var(--pf-global--danger-color--100)' } }
                    title={null} />
            </React.Fragment>
        );
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

        expect(compliantIcon(system)).toEqual(
            <React.Fragment>
                <ExclamationCircleIcon color='currentColor' noVerticalAlign={false} size='sm'
                    style={ { color: 'var(--pf-global--danger-color--100)' } }
                    title={null} />
            </React.Fragment>
        );
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

        expect(compliantIcon(system)).toEqual(
            <React.Fragment>
                <CheckCircleIcon color='currentColor' noVerticalAlign={false} size="sm"
                    style={ { color: 'var(--pf-global--success-color--100)' } }
                    title={null} />
            </React.Fragment>
        );
    });

    it('should show a question mark icon if the host has no rules passed or failed', () => {
        const system = {
            rulesPassed: 0,
            rulesFailed: 0
        };

        expect(compliantIcon(system)).toEqual(
            <React.Fragment>
                <QuestionCircleIcon color='currentColor' noVerticalAlign={false} size="sm"
                    style={ { color: 'var(--pf-global--disabled-color--100)' } }
                    title={null} />
            </React.Fragment>
        );
    });
});
