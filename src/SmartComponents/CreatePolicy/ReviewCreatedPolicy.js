import React from 'react';
import {
    Text,
    TextVariants,
    TextContent,
    TextList,
    TextListVariants,
    TextListItem,
    TextListItemVariants
} from '@patternfly/react-core';
import { reduxForm } from 'redux-form';

const ReviewCreatedPolicy = () => {
    return (
        <React.Fragment>
            <TextContent>
                <Text component={TextVariants.h1}>
                    Review
                </Text>
                <Text component={TextVariants.h4}>
                    Review your policy before finishing. Operating system, profile type and ID cannot be changed after
                    initial creation. Make sure they are correct!
                </Text>
                <TextList component={TextListVariants.dl}>
                    <TextListItem component={TextListItemVariants.dt}>SCAP security guide</TextListItem>
                    <TextListItem component={TextListItemVariants.dd}>
                      TBD
                    </TextListItem>
                    <TextListItem component={TextListItemVariants.dt}>Profile type</TextListItem>
                    <TextListItem component={TextListItemVariants.dd}>TBD</TextListItem>
                    <TextListItem component={TextListItemVariants.dt}>Generated ID</TextListItem>
                    <TextListItem component={TextListItemVariants.dd}>TBD</TextListItem>
                    <TextListItem component={TextListItemVariants.dt}>Policy name</TextListItem>
                    <TextListItem component={TextListItemVariants.dd}>TBD</TextListItem>
                    <TextListItem component={TextListItemVariants.dt}># of rules</TextListItem>
                    <TextListItem component={TextListItemVariants.dd}>TBD</TextListItem>
                    <TextListItem component={TextListItemVariants.dt}># of systems</TextListItem>
                    <TextListItem component={TextListItemVariants.dd}>TBD</TextListItem>
                </TextList>
            </TextContent>
        </React.Fragment>
    );
};

export default reduxForm({
    form: 'policyForm',
    destroyOnUnmount: false
})(ReviewCreatedPolicy);
