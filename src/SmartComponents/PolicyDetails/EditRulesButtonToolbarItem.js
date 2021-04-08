import React from 'react';
import propTypes from 'prop-types';
import { ToolbarItem, Button } from '@patternfly/react-core';
import { BackgroundLink } from 'PresentationalComponents';
import { useAnchor } from 'Utilities/Router';

const EditRulesButtonToolbarItem = ({ policy }) => {
    let anchor = useAnchor();

    return (
        <ToolbarItem>
            <BackgroundLink
                to={ `/scappolicies/${ policy.id }/edit` }
                state={ { policy } }
                hash={ anchor }
                backgroundLocation={ { hash: anchor } }>
                <Button variant='primary'>Edit rules</Button>
            </BackgroundLink>
        </ToolbarItem>
    );
};

EditRulesButtonToolbarItem.propTypes = {
    policy: propTypes.object.isRequired
};

export default EditRulesButtonToolbarItem;
