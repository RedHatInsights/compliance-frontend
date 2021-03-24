import React, { useEffect } from 'react';
import { propTypes as reduxFormPropTypes, reduxForm, formValueSelector } from 'redux-form';
import { Form, FormGroup, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { InventoryTable, SystemsTable } from 'SmartComponents';
import { GET_SYSTEMS_WITHOUT_FAILED_RULES } from '../SystemsTable/constants';
import { compose } from 'redux';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import useFeature from 'Utilities/hooks/useFeature';
import { systemName, countOsMinorVersions } from 'Store/Reducers/SystemStore';

const EditPolicySystems = ({ change, osMajorVersion, osMinorVersionCounts, selectedSystemIds }) => {
    const newInventory = useFeature('newInventory');
    const columns = [{
        key: 'facts.compliance.display_name',
        title: 'Name',
        props: {
            width: 40, isStatic: true
        },
        ...newInventory && {
            key: 'display_name',
            renderFunc: systemName
        }
    }, {
        key: 'facts.compliance.policies',
        title: 'Policies',
        props: {
            width: 40, isStatic: true
        },
        ...newInventory && {
            key: 'policies'
        }
    }];

    useEffect(() => {
        if (selectedSystemIds) {
            change('systems', selectedSystemIds);
        }

        if (osMinorVersionCounts) {
            change('osMinorVersionCounts', osMinorVersionCounts);
        }
    }, [selectedSystemIds, osMinorVersionCounts, change]);

    const InvCmp = newInventory ? InventoryTable : SystemsTable;

    return (
        <React.Fragment>
            <TextContent className="pf-u-mb-md">
                <Text component={TextVariants.h1}>
                    Systems
                </Text>
                <Text>
                    Select which of your <b>RHEL { osMajorVersion }</b> systems should be included
                    in this policy.<br />
                    Systems can be added or removed at any time.
                </Text>
            </TextContent>
            <Form>
                <FormGroup>
                    <InvCmp
                        emptyStateComponent={ "NO systems choose different OS" }
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
