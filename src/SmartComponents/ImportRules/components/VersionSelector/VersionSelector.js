import React, { useCallback, useMemo } from 'react';
import { Form, Flex, FlexItem } from '@patternfly/react-core';

import VersionSelect from './components/VersionSelect';

const VersionSelector = ({
  tailorings,
  securityGuideProfile,
  canSelectVersionToApply,
  onChange,
}) => {
  const versionsToCopy = useMemo(
    () =>
      tailorings.map((tailoring) => ({
        label: `RHEL ${tailoring.os_major_version}.${tailoring.os_minor_version}`,
        value: tailoring.id,
      })),
    [tailorings],
  );

  const versionsToApply = useMemo(
    () =>
      securityGuideProfile?.os_minor_versions.map((osMinorVersion) => ({
        label: `RHEL ${securityGuideProfile.os_major_version}.${osMinorVersion}`,
        value: osMinorVersion,
      })),
    [securityGuideProfile],
  );

  return (
    <Form>
      <Flex>
        <Flex flex={{ default: 'flex_1' }}>
          <FlexItem>
            <VersionSelect
              label="Copy and import rules from"
              aria-label="Import version selection"
              placeholder="Choose version to import"
              options={versionsToCopy}
              onChange={(tailoringId) => onChange?.('tailoringId', tailoringId)}
            />
          </FlexItem>
        </Flex>
        <Flex flex={{ default: 'flex_1' }}>
          <FlexItem>
            <VersionSelect
              isDisabled={!canSelectVersionToApply}
              label="Paste and apply rules to"
              aria-label="Apply version selection"
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

export default VersionSelector;
