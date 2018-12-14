import React from 'react';
import propTypes from 'prop-types';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { Table, Input, routerParams } from '@red-hat-insights/insights-frontend-components';
import { SearchIcon } from '@patternfly/react-icons';
import { Grid, GridItem } from '@patternfly/react-core';

class SystemRulesTable extends React.Component {
    rulesToRows(profileRules) {
        const rows = profileRules.map((profileRule) => (
            profileRule.rules.map(rule => ({
                cells: [
                    rule.title,
                    profileRule.profile,
                    rule.severity,
                    (rule.compliant ? <CheckCircleIcon/> : <ExclamationCircleIcon/>)
                ]
            }))
        )).reduce((a, b) => a.concat(b), []);
        return rows;
    }

    render() {
        return (
            <React.Fragment>
                <Grid gutter="sm">
                    <GridItem span={3}>
                        <Input
                            id="search"
                            type="text"
                            style={{ width: '200px' }}
                        />{' '}
                        <SearchIcon style={{ paddingTop: '4px' }} />
                    </GridItem>

                    <GridItem span={12}>
                        <Table
                            header={['Title', 'Policy', 'Severity', 'Passed']}
                            rows={this.rulesToRows(this.props.profileRules)}
                        />
                    </GridItem>
                </Grid>
            </React.Fragment>
        );
    }
}

SystemRulesTable.propTypes = {
    profileRules: propTypes.array
};

export default routerParams(SystemRulesTable);
