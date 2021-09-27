import React from 'react';
import propTypes from 'prop-types';
import Truncate from '@redhat-cloud-services/frontend-components/Truncate';
import {
  Grid,
  GridItem,
  Label,
  TextContent,
  Text,
  Tooltip,
  Radio,
} from '@patternfly/react-core';

const InUseProfileLabel = () => (
  <Tooltip
    position="right"
    content="A policy of this type is already in use.
        Only one policy per policy type can be created for a major release of RHEL."
  >
    <Label color="orange" style={{ lineHeight: '1.5em' }}>
      In use
    </Label>
  </Tooltip>
);

const ProfileTypeSelect = ({ profiles, onChange, selectedProfile }) => (
  <React.Fragment>
    {profiles?.length === 0 && (
      <TextContent style={{ color: 'var(--pf-c-content--blockquote--Color)' }}>
        <Text>Select an operating system to view policy types.</Text>
      </TextContent>
    )}

    <Grid hasGutter>
      {profiles.map((profile) => {
        const { description, name, id, disabled } = profile;
        return (
          <React.Fragment key={`profile-select-${id}`}>
            <GridItem span={8} rowSpan={2}>
              <Radio
                id={`profile-select-text-${id}`}
                label={
                  <>
                    {` ${name} `}
                    {disabled && <InUseProfileLabel />}
                  </>
                }
                isDisabled={disabled}
                description={
                  <Truncate
                    inline
                    key={`profile-select-text-${id}`}
                    length={190}
                    text={description}
                  />
                }
                isChecked={selectedProfile === JSON.stringify(profile)}
                onChange={(_, event) => onChange(event.currentTarget?.value)}
                value={JSON.stringify(profile)}
              />
            </GridItem>
          </React.Fragment>
        );
      })}
    </Grid>
  </React.Fragment>
);

ProfileTypeSelect.propTypes = {
  profiles: propTypes.array,
  onChange: propTypes.func,
  selectedProfile: propTypes.object,
};

ProfileTypeSelect.defaultProps = {
  profiles: [],
  onClick: () => ({}),
};

export default ProfileTypeSelect;
