import React from 'react';
import PropTypes from 'prop-types';

import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import pf4ComponentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';

export const mapperExtension = {
    // 'field-type': Component,
};

const CustomFormRenderer = ({ componentMapper, ...props }) => (
    <FormRenderer
        FormTemplate={ FormTemplate }
        componentMapper = {{
            ...pf4ComponentMapper,
            ...mapperExtension,
            ...componentMapper
        }}
        { ...props } />
);

CustomFormRenderer.propTypes = {
    componentMapper: PropTypes.object
};

export default CustomFormRenderer;
