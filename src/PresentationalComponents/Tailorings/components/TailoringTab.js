import React from 'react';
import propTypes from 'prop-types';
import { Grid, Spinner } from '@patternfly/react-core';
import { StateViewWithError, StateViewPart } from 'PresentationalComponents';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import { useFullTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';
import RulesTable from '../../RulesTable/RulesTableRest';
import useTailoringsData from '../hooks/useTailoringsData';
import TabHeader from './TabHeader';

const TailoringTab = ({
  policy,
  tailoring,
  columns,
  systemCount,
  rulesTableProps,
  resetLink,
  rulesPageLink,
  setRuleValues,
  ruleValues,
  onRuleValueReset,
}) => {
  const tableState = useFullTableState();
  const { data, error, loading } = useTailoringsData(
    policy,
    tailoring,
    tableState
  );
  const { rules, ruleTree } = data;

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
      <StateViewWithError stateValues={{ data, error, loading }}>
        <StateViewPart stateKey="loading">
          <Spinner />
        </StateViewPart>
        <StateViewPart stateKey="data">
          <RulesTable
            total={rules?.meta?.total}
            rules={rules?.data}
            ruleTree={ruleTree}
            ansibleSupportFilter
            remediationsEnabled={false}
            columns={columns}
            setRuleValues={setRuleValues}
            ruleValues={ruleValues}
            onRuleValueReset={onRuleValueReset}
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
