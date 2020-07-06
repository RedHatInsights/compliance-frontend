import React from 'react';
import { Field } from 'redux-form';
import propTypes from 'prop-types';
import Truncate from 'react-truncate';
import {
    Grid,
    GridItem,
    TextContent,
    TextVariants,
    Text
} from '@patternfly/react-core';

const ProfileTypeSelect  = ({ profiles, onClick }) => (
    <React.Fragment>
        <Grid hasGutter>
            { profiles.map((profile) => {
                const { description, name, id } = profile;
                return (
                    <React.Fragment key={id}>
                        <GridItem span={8} rowSpan={2}>
                            <Text>
                                <Field component='input'
                                    type='radio'
                                    name='profile'
                                    value={JSON.stringify(profile)}
                                    onClick={ () => onClick(JSON.stringify(profile)) }
                                />
                                { ` ${name}` }
                            </Text>
                            <TextContent style={{ color: 'var(--pf-c-content--blockquote--Color)' }}>
                                <Text component={TextVariants.p}>
                                    <Truncate key={id} lines={3}>{description}</Truncate>
                                </Text>
                            </TextContent>
                        </GridItem>
                    </React.Fragment>);
            })}
        </Grid>
    </React.Fragment>
);

ProfileTypeSelect.propTypes = {
    profiles: propTypes.array,
    onClick: propTypes.func
};

ProfileTypeSelect.defaultProps = {
    profiles: [],
    onClick: () => ({})
};

export default ProfileTypeSelect;
