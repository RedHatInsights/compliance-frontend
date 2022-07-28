import React from 'react';
import propTypes from 'prop-types';
import { RulesTable } from 'PresentationalComponents';
import SystemPolicyCards from './SystemPolicyCards';
import EmptyState from './EmptyState';
import '../compliance.scss';
import useSelectedPolicies from '../hooks/useSelectedPolicies';

const Details = ({ system, hidePassed }) => {
  const policies = system?.testResultProfiles;
  const { selectedPolicies, setOrUnsetPolicy, onDeleteFilter } =
    useSelectedPolicies(policies);

  return (
    <>
      <SystemPolicyCards
        policies={policies}
        selectedPolicies={selectedPolicies}
        onCardClick={(policy) => {
          setOrUnsetPolicy(policy);
        }}
      />
      <br />
      {system?.testResultProfiles?.length ? (
        <RulesTable
          ansibleSupportFilter
          hidePassed={hidePassed}
          system={{
            ...system,
            supported:
              (system?.testResultProfiles || []).filter(
                (profile) => profile.supported
              ).length > 0,
          }}
          profileRules={system?.testResultProfiles.map((profile) => ({
            system,
            profile,
            rules: profile.rules,
          }))}
          options={{
            sortBy: {
              index: 4,
              direction: 'asc',
              property: 'severity',
            },
            onDeleteFilter,
          }}
          activeFilters={{
            policy: selectedPolicies,
          }}
        />
      ) : (
        <EmptyState system={system} />
      )}
    </>
  );
};

Details.propTypes = {
  system: propTypes.object,
  hidePassed: propTypes.bool,
};

export default Details;
