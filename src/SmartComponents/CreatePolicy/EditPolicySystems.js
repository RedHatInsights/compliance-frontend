import React, { useEffect } from 'react';
import { propTypes as reduxFormPropTypes, reduxForm } from 'redux-form';
import { Form, FormGroup, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { InventoryTable, SystemsTable } from 'SmartComponents';
import { compose } from 'redux';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import useFeature from 'Utilities/hooks/useFeature';

const EditPolicySystems = ({ change, selectedSystemIds }) => {
    const newInventory = useFeature('newInventory');
    const columns = [{
        composed: ['facts.os_release', 'display_name'],
        key: 'facts.compliance.display_name',
        title: 'System name',
        props: {
            width: 40, isStatic: true
        },
        ...newInventory && {
            key: 'display_name'
        }
    }, {
        key: 'facts.compliance.profiles',
        title: 'Policies',
        props: {
            width: 40, isStatic: true
        },
        ...newInventory && {
            key: 'profiles'
        }
    }];

    useEffect(() => {
        if (selectedSystemIds) {
            change('systems', selectedSystemIds);
        }
    }, [selectedSystemIds]);

    const InvCmp = newInventory ? InventoryTable : SystemsTable;

    return (
        <React.Fragment>
            <TextContent>
                <Text component={TextVariants.h1}>
                    Systems
                </Text>
                <Text component={TextVariants.h4}>
                    Choose systems to scan with this policy. You can add and remove systems later.
                </Text>
            </TextContent>
            <Form>
                <FormGroup>
                    <InvCmp
                        columns={columns}
                        remediationsEnabled={false}
                        compact
                        showActions={ false }
                        showAllSystems
                        enableExport={ false }/>
                </FormGroup>
            </Form>
        </React.Fragment>
    );
};

EditPolicySystems.propTypes = {
    selectedSystemIds: propTypes.array,
    change: reduxFormPropTypes.change
};

EditPolicySystems.defaultProps = {
    selectedSystemIds: []
};

const mapStateToProps = ({ entities }) => ({
    selectedSystemIds: (entities?.selectedEntities || []).map((e) => (e.id))
});

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'policyForm',
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true
    })
)(EditPolicySystems);
