import React from 'react';
import {
  Alert,
  AlertActionLink,
  Text,
  TextContent,
} from '@patternfly/react-core';
import propTypes from 'prop-types';
import { InventoryTable } from 'SmartComponents';
import { GET_SYSTEMS_WITHOUT_FAILED_RULES } from '../SystemsTable/constants';
import { useHistory } from 'react-router-dom';
import * as Columns from '../SystemsTable/Columns';

const EmptyState = ({ osMajorVersion }) => (
  <React.Fragment>
    <TextContent className="pf-u-mb-md">
      <Text>
        You do not have any <b>RHEL {osMajorVersion}</b> systems connected to
        Insights and enabled for Compliance.
      </Text>
    </TextContent>
    <TextContent className="pf-u-mb-md">
      <Text>Connect RHEL {osMajorVersion} systems to Insights.</Text>
    </TextContent>
  </React.Fragment>
);

EmptyState.propTypes = {
  osMajorVersion: propTypes.string,
};

const PrependComponent = ({ osMajorVersion }) => (
  <React.Fragment>
    <TextContent className="pf-u-mb-md">
      <Text>
        Select which of your <b>RHEL {osMajorVersion}</b> systems should be
        included in this policy.
      </Text>
    </TextContent>
  </React.Fragment>
);

PrependComponent.propTypes = {
  osMajorVersion: propTypes.string,
};

const EditPolicySystemsTab = ({
  policy: { osMajorVersion },
  newRuleTabs,
  onSystemSelect,
  selectedSystems,
}) => {
  const { push, location } = useHistory();

  return (
    <React.Fragment>
      <InventoryTable
        columns={[
          Columns.Name,
          Columns.inventoryColumn('tags'),
          Columns.OperatingSystem,
        ]}
        showOsMinorVersionFilter={[osMajorVersion]}
        prependComponent={<PrependComponent osMajorVersion={osMajorVersion} />}
        emptyStateComponent={<EmptyState osMajorVersion={osMajorVersion} />}
        compact
        showActions={false}
        query={GET_SYSTEMS_WITHOUT_FAILED_RULES}
        defaultFilter={osMajorVersion && `os_major_version = ${osMajorVersion}`}
        enableExport={false}
        remediationsEnabled={false}
        preselectedSystems={selectedSystems}
        onSelect={onSystemSelect}
      />
      {newRuleTabs && (
        <Alert
          variant="info"
          isInline
          title="You selected a system that has a release version previously not included in this policy."
          actionLinks={
            <AlertActionLink
              onClick={() => push({ ...location, hash: '#rules' })}
            >
              Open rule editing
            </AlertActionLink>
          }
        >
          <p>
            If you have edited any rules for this policy, you will need to do so
            for this release version as well.
          </p>
        </Alert>
      )}
    </React.Fragment>
  );
};

EditPolicySystemsTab.propTypes = {
  policy: propTypes.object,
  newRuleTabs: propTypes.bool,
  onSystemSelect: propTypes.func,
  selectedSystems: propTypes.array,
};

export default EditPolicySystemsTab;
