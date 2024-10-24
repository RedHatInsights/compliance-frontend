import React from 'react';
import propTypes from 'prop-types';
import { Spinner, Tab } from '@patternfly/react-core';
import {
  RoutedTabs,
  StateViewWithError,
  StateViewPart,
} from 'PresentationalComponents';
import { useTailorings } from 'Utilities/hooks/api/useTailorings';
import OsVersionText from '../TabbedRules/OsVersionText';
import TailoringTab from './components/TailoringTab';
import { eventKey } from './helpers';

// TODO Systems count on tabs -> may need API change
// TODO defaultTab  defaultTab={getDefaultTab(tailorings, defaultTab)}
const Tailorings = ({
  policy,
  defaultTab,
  columns,
  level = 0,
  ouiaId,
  onValueOverrideSave,
  ...rulesTableProps
}) => {
  const { data, loading, error } = useTailorings({
    params: [
      policy.id,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      'NOT(null? os_minor_version)', // TODO doublecheck if this is right
    ],
    skip: !policy,
  });
  const tailorings = data?.data;
  const onValueSave = (...valueParams) =>
    onValueOverrideSave(policy, ...valueParams);

  return (
    <StateViewWithError stateValues={{ error, data: tailorings, loading }}>
      <StateViewPart stateKey="loading">
        <Spinner />
      </StateViewPart>
      <StateViewPart stateKey="data">
        {tailorings && (
          <RoutedTabs
            ouiaId={ouiaId}
            level={level}
            defaultTab={eventKey(tailorings[0])}
          >
            {tailorings?.map((tailoring) => (
              <Tab
                key={eventKey(tailoring)}
                eventKey={eventKey(tailoring)}
                aria-label={`Rules for RHEL ${tailoring.os_major_version}.${tailoring.os_minor_version}`}
                title={
                  <OsVersionText
                    profile={{
                      osMajorVersion: tailoring.os_major_version,
                      osMinorVersion: tailoring.os_minor_version,
                    }}
                  />
                }
                ouiaId={`RHEL ${tailoring.os_major_version}.${tailoring.os_minor_version}`}
              >
                <TailoringTab
                  {...{
                    policy,
                    tailoring,
                    columns,
                    rulesTableProps,
                    onValueOverrideSave: onValueSave,
                  }}
                />
              </Tab>
            ))}
          </RoutedTabs>
        )}
      </StateViewPart>
    </StateViewWithError>
  );
};

Tailorings.propTypes = {
  policy: propTypes.object.isRequired,
  selectedRuleRefIds: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.string,
      ruleRefIds: propTypes.arrayOf(propTypes.string),
    })
  ),
  setSelectedRuleRefIds: propTypes.func,
  columns: propTypes.arrayOf(propTypes.object),
  defaultTab: propTypes.shape({
    id: propTypes.string,
    osMinorVersion: propTypes.string,
  }),
  level: propTypes.number,
  ouiaId: propTypes.string,
  resetLink: propTypes.bool,
  rulesPageLink: propTypes.bool,
  setRuleValues: propTypes.func,
  ruleValues: propTypes.array,
  onRuleValueReset: propTypes.func,
  onValueOverrideSave: propTypes.func,
};

export default Tailorings;
