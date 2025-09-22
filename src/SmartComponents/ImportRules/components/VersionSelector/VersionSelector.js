import React, { useMemo } from 'react';
import propTypes from 'prop-types';
import { Form, Flex, FlexItem } from '@patternfly/react-core';

import VersionSelect from './components/VersionSelect';
import {
  optionsFromTailorings,
  optionsFromSecurityGuideProfileVersions,
} from './helpers';

const VersionSelector = ({
  tailorings,
  securityGuideProfile,
  values: { tailoringId, osMinorVersion },
  onChange,
}) => {
  const versionsToCopy = useMemo(
    () => optionsFromTailorings(tailorings),
    [tailorings],
  );
  const selectedOsMinorVersion = tailorings?.find(
    ({ id }) => id === tailoringId,
  )?.os_minor_version;

  const versionsToApply = useMemo(
    () =>
      optionsFromSecurityGuideProfileVersions(
        securityGuideProfile,
        selectedOsMinorVersion,
      ),
    [securityGuideProfile, selectedOsMinorVersion],
  );

  return (
    <Form>
      <Flex>
        <Flex flex={{ default: 'flex_1' }}>
          <FlexItem>
            <VersionSelect
              label="Copy and import rules from"
              aria-label="Import version selection"
              placeholder="Choose version to import rules from"
              options={versionsToCopy}
              value={tailoringId}
              onChange={(tailoringId) => onChange?.('tailoringId', tailoringId)}
            />
          </FlexItem>
        </Flex>
        <Flex flex={{ default: 'flex_1' }}>
          <FlexItem>
            <VersionSelect
              isDisabled={!tailoringId}
              label="Paste and apply rules to"
              aria-label="Apply version selection"
              placeholder="Choose version to apply rules to"
              value={osMinorVersion}
              onChange={(osMinorVersion) =>
                onChange?.('osMinorVersion', osMinorVersion)
              }
              options={versionsToApply}
            />
          </FlexItem>
        </Flex>
      </Flex>
    </Form>
  );
};

VersionSelector.propTypes = {
  securityGuideProfile: propTypes.object,
  tailorings: propTypes.array,
  canSelectVersionToApply: propTypes.bool,
  values: propTypes.object,
  onChange: propTypes.func,
};

export default VersionSelector;
