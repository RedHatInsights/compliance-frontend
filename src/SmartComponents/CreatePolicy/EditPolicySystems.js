import React, { useEffect } from 'react';
import { propTypes as reduxFormPropTypes, reduxForm, formValueSelector } from 'redux-form';
import { Button, Form, FormGroup, Text, TextContent, TextVariants, WizardContextConsumer } from '@patternfly/react-core';
import { InventoryTable } from 'SmartComponents';
import { GET_SYSTEMS_WITHOUT_FAILED_RULES } from '../SystemsTable/constants';
import { compose } from 'redux';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { countOsMinorVersions } from 'Store/Reducers/SystemStore';

const EmptyState = ({ osMajorVersion }) => (
    <React.Fragment>
        <TextContent className="pf-u-mb-md">
            <Text>
                You do not have any <b>RHEL { osMajorVersion }</b> systems connected to Insights and enabled for Compliance.<br/>
                Policies must be created with at least one system.
            </Text>
        </TextContent>
        <TextContent className="pf-u-mb-md">
            <Text>
                Choose a different operating system, or connect <b>RHEL { osMajorVersion }</b> systems to Insights.
            </Text>
        </TextContent>
        <WizardContextConsumer>
            { ({ goToStepById }) => <Button onClick={() => goToStepById(1)}>Choose a different operating system</Button> }
        </WizardContextConsumer>
    </React.Fragment>
);

EmptyState.propTypes = {
    osMajorVersion: propTypes.string
};

const PrependComponent = ({ osMajorVersion }) => (
    <React.Fragment>
        <TextContent className="pf-u-mb-md">
            <Text>
                Select which of your <b>RHEL { osMajorVersion }</b> systems should be included
                in this policy.<br />
                Systems can be added or removed at any time.
            </Text>
        </TextContent>
    </React.Fragment>
);

PrependComponent.propTypes = {
    osMajorVersion: propTypes.string
};

export const EditPolicySystems = ({ change, osMajorVersion, osMinorVersionCounts, selectedSystemIds }) => {
    const columns = [{
        key: 'display_name',
        title: 'Name',
        props: {
            width: 40, isStatic: true
        },
        renderFunc: (displayName, _id, { name }) => (displayName || name)
    }, {
        key: 'osMinorVersion',
        title: 'Operating system',
        props: {
            width: 40, isStatic: true
        },
        renderFunc: (osMinorVersion, _id, { osMajorVersion }) => `RHEL ${osMajorVersion}.${osMinorVersion}`
    }];

    useEffect(() => {
        if (selectedSystemIds) {
            change('systems', selectedSystemIds);
        }

        if (osMinorVersionCounts) {
            change('osMinorVersionCounts', osMinorVersionCounts);
        }
    }, [selectedSystemIds, osMinorVersionCounts, change]);

    return (
        <React.Fragment>
            <TextContent className="pf-u-mb-md">
                <Text component={TextVariants.h1}>
                    Systems
                </Text>
            </TextContent>
            <Form>
                <FormGroup>
                    <InventoryTable
                        showOsMinorVersionFilter={ [osMajorVersion] }
                        prependComponent={ <PrependComponent osMajorVersion={ osMajorVersion } /> }
                        emptyStateComponent={ <EmptyState osMajorVersion={ osMajorVersion } /> }
                        columns={columns}
                        remediationsEnabled={false}
                        compact
                        showActions={ false }
                        query={ GET_SYSTEMS_WITHOUT_FAILED_RULES }
                        defaultFilter={ osMajorVersion && `os_major_version = ${osMajorVersion}` }
                        enableExport={ false }/>
                </FormGroup>
            </Form>
        </React.Fragment>
    );
};

EditPolicySystems.propTypes = {
    osMajorVersion: propTypes.string,
    osMinorVersionCounts: propTypes.arrayOf(propTypes.shape({
        osMinorVersion: propTypes.number,
        count: propTypes.number
    })),
    selectedSystemIds: propTypes.array,
    change: reduxFormPropTypes.change
};

EditPolicySystems.defaultProps = {
    selectedSystemIds: [],
    osMinorVersionCounts: []
};

const selector = formValueSelector('policyForm');
const mapStateToProps = (state) => ({
    osMajorVersion: selector(state, 'osMajorVersion'),
    osMinorVersionCounts: countOsMinorVersions(state.entities?.selectedEntities),
    selectedSystemIds: (state.entities?.selectedEntities || []).map((e) => (e.id))
});

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'policyForm',
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true
    })
)(EditPolicySystems);
