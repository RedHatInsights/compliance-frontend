import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as ReactRedux from 'react-redux';
import {
    Table as PfTable,
    TableBody,
    TableHeader,
    TableGridBreakpoint,
    cellWidth,
    TableVariant,
    sortable,
    expandable,
    SortByDirection,
    classNames
} from '@patternfly/react-table/dist/esm';
import { reactCore } from '@redhat-cloud-services/frontend-components-utilities/files/inventoryDependencies';
import gql from 'graphql-tag';
import pickBy from 'lodash/pickBy';
import { systemsPolicyFilterConfiguration, systemsOsFilterConfiguration } from '@/constants';

export const asyncInventoryLoader = () => insights.loadInventory({
    ReactRedux,
    React,
    reactRouterDom,
    pfReactTable: {
        Table: PfTable,
        TableBody,
        TableHeader,
        TableGridBreakpoint,
        cellWidth,
        TableVariant,
        sortable,
        expandable,
        SortByDirection,
        classNames
    },
    pfReact: reactCore
});

export const GET_SYSTEMS = gql`
query getSystems($filter: String!, $policyId: ID, $perPage: Int, $page: Int) {
    systems(search: $filter, limit: $perPage, offset: $page) {
        totalCount
        edges {
            node {
                id
                name
                osMajorVersion
                osMinorVersion
                testResultProfiles(policyId: $policyId) {
                    id
                    name
                    refId
                    lastScanned
                    compliant
                    external
                    score
                    supported
                    ssgVersion
                    rules {
                        refId
                        title
                        compliant
                        remediationAvailable
                    }
                }
                policies(policyId: $policyId) {
                    id
                    name
                }
            }
        }
    }
}
`;

export const GET_SYSTEMS_WITHOUT_FAILED_RULES = gql`
query getSystems($filter: String!, $policyId: ID, $perPage: Int, $page: Int) {
    systems(search: $filter, limit: $perPage, offset: $page) {
        totalCount
        edges {
            node {
                id
                name
                osMajorVersion
                osMinorVersion
                testResultProfiles(policyId: $policyId) {
                    id
                    name
                    lastScanned
                    external
                    compliant
                    score
                    supported
                    ssgVersion
                    policy {
                        id
                    }
                }
                policies(policyId: $policyId) {
                    id
                    name
                }
            }
        }
    }
}
`;

export const policyFilter = (policies, osFilter) => ([
    ...systemsPolicyFilterConfiguration(policies),
    ...(osFilter ? systemsOsFilterConfiguration(policies) : [])
]);

export const initFilterState = (filterConfig) => (
    pickBy(filterConfig.initialDefaultState(), (value) => (!!value))
);
