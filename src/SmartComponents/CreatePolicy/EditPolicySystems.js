import React, { useEffect } from 'react';
import { propTypes as reduxFormPropTypes, reduxForm, formValueSelector } from 'redux-form';
import { Button, Form, FormGroup, Text, TextContent, TextVariants, WizardContextConsumer } from '@patternfly/react-core';
import { InventoryTable, SystemsTable } from 'SmartComponents';
import { GET_SYSTEMS_WITHOUT_FAILED_RULES } from '../SystemsTable/constants';
import { compose } from 'redux';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import useFeature from 'Utilities/hooks/useFeature';
import { systemName, countOsMinorVersions } from 'Store/Reducers/SystemStore';

const EditPolicySystems = ({ change, osMajorVersion, osMinorVersionCounts, selectedSystemIds }) => {
    const newInventory = useFeature('newInventory');
    const multiversionRules = useFeature('multiversionTabs');

    const columns = [{
        key: 'facts.compliance.display_name',
        title: 'Name',
        props: {
            width: 40, isStatic: true
        },
        ...newInventory && {
            key: 'display_name',
            renderFunc: (displayName, id, { name }) => systemName(displayName, id, { name })
        }
    }, {
        key: 'facts.compliance.osMinorVersion',
        title: 'Operating system',
        props: {
            width: 40, isStatic: true
        },
        ...newInventory && {
            key: 'osMinorVersion',
            renderFunc: (osMinorVersion, _id, { osMajorVersion }) => `RHEL ${osMajorVersion}.${osMinorVersion}`
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

    const emptyStateComponent = (<React.Fragment>
        <TextContent className="pf-u-mb-md">
            <Text>
                You do not have any <b>RHEL { osMajorVersion }</b> systems connected to Insights and enabled for Compliance.<br/>
                Policies must be created with at least one system.
            </Text>
        </TextContent>
        <TextContent className="pf-u-mb-md">
            <Text>
                Choose a different operating system, or connect RHEL { osMajorVersion } systems to Insights.
            </Text>
        </TextContent>
        <WizardContextConsumer>
            { ({ goToStepById }) => <Button onClick={() => goToStepById(1)}>Choose a different operating system</Button> }
        </WizardContextConsumer>
    </React.Fragment>);

    const prependComponent = (<React.Fragment>
        <TextContent className="pf-u-mb-md">
            <Text>
                Select which of your <b>RHEL { osMajorVersion }</b> systems should be included
                in this policy.<br />
                Systems can be added or removed at any time.
            </Text>
        </TextContent>
    </React.Fragment>);

    const InvCmp = newInventory ? InventoryTable : SystemsTable;

    return (
        <React.Fragment>
            <TextContent className="pf-u-mb-md">
                <Text component={TextVariants.h1}>
                    Systems
                </Text>
            </TextContent>
            <Form>
                <FormGroup>
                    <InvCmp
                        prependComponent={prependComponent}
                        emptyStateComponent={multiversionRules ? emptyStateComponent : undefined}
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
