import React from 'react';
import propTypes from 'prop-types';
import { Grid } from '@patternfly/react-core';
import { StateViewWithError, StateViewPart } from 'PresentationalComponents';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import { useFullTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import RulesTable from '../../RulesTable/RulesTableRest';
import useTailoringsData from '../hooks/useTailoringsData';
import useRulesExporter from '../hooks/useRulesExporter';
import TabHeader from './TabHeader';

// TODO Pass on and enable ruleTree here when RHINENG-13519 is done
const TailoringTab = ({
  policy,
  tailoring,
  columns,
  systemCount,
  rulesTableProps,
  resetLink,
  rulesPageLink,
  setRuleValues,
  onRuleValueReset,
}) => {
  const tableState = useFullTableState();
  const { data, error, fetchRules } = useTailoringsData(
    policy,
    tailoring,
    tableState
  );
  const { rules, valueDefinitions } = data;
  const rulesExporter = useRulesExporter(fetchRules);

  return (
    <>
      <Grid>
        <TabHeader
          tailoring={tailoring}
          rulesPageLink={rulesPageLink}
          resetLink={resetLink}
          systemCount={systemCount}
        />
      </Grid>
      <StateViewWithError stateValues={{ data, error }}>
        <StateViewPart stateKey="data">
          <RulesTable
            policyId={policy.id}
            securityGuideId={tailoring.security_guide_id}
            total={rules?.meta?.total}
            rules={rules?.data}
            ansibleSupportFilter
            remediationsEnabled={false}
            columns={columns}
            setRuleValues={setRuleValues}
            ruleValues={tailoring.value_overrides}
            valueDefinitions={valueDefinitions}
            onRuleValueReset={onRuleValueReset}
            options={{
              exporter: rulesExporter,
            }}
            {...rulesTableProps}
          />
        </StateViewPart>
      </StateViewWithError>
    </>
  );
};

TailoringTab.propTypes = {
  policy: propTypes.object,
  tailoring: propTypes.object,
  columns: propTypes.array,
  handleSelect: propTypes.func,
  systemCount: propTypes.number,
  selectedRuleRefIds: propTypes.array,
  rulesTableProps: propTypes.object,
  resetLink: propTypes.bool,
  rulesPageLink: propTypes.bool,
  setRuleValues: propTypes.func,
  ruleValues: propTypes.array,
  onRuleValueReset: propTypes.func,
};

const TailoringTabProvider = (props) => (
  <TableStateProvider>
    <TailoringTab {...props} />
  </TableStateProvider>
);

export default TailoringTabProvider;
