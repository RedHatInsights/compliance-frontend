import React from 'react';
import { Field } from 'redux-form';
import propTypes from 'prop-types';
import Truncate from 'react-truncate';
import {
  Grid,
  GridItem,
  Label,
  TextContent,
  TextVariants,
  Text,
  Tooltip,
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

const ProfileTypeSelect = ({ profiles, onClick }) => (
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
              <TextContent
                style={{
                  lineHeight: '2em',
                  color: disabled
                    ? 'var(--pf-c-content--blockquote--Color)'
                    : '',
                }}
              >
                <Text>
                  <Field
                    component="input"
                    type="radio"
                    name="profile"
                    value={JSON.stringify(profile)}
                    onClick={() => onClick(JSON.stringify(profile))}
                    disabled={disabled}
                  />
                  {` ${name} `}
                  {disabled && <InUseProfileLabel />}
                </Text>
              </TextContent>
              <TextContent
                style={{ color: 'var(--pf-c-content--blockquote--Color)' }}
              >
                <Text component={TextVariants.p}>
                  <Truncate key={`profile-select-text-${id}`} lines={3}>
                    {description}
                  </Truncate>
                </Text>
              </TextContent>
            </GridItem>
          </React.Fragment>
        );
      })}
    </Grid>
  </React.Fragment>
);

ProfileTypeSelect.propTypes = {
  profiles: propTypes.array,
  onClick: propTypes.func,
};

ProfileTypeSelect.defaultProps = {
  profiles: [],
  onClick: () => ({}),
};

export default ProfileTypeSelect;
