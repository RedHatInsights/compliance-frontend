import React from 'react';
import propTypes from 'prop-types';
import { Popover, Tooltip, Text } from '@patternfly/react-core';
import { ExclamationTriangleIcon, OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { supportedConfigsLink } from '@redhat-cloud-services/frontend-components-inventory-compliance';

const UNSUPPORTED_SINGULAR_MESSAGE =
    'This system was using an incompatible version of the SSG at the time this report was generated. ' +
    'Assessment of rules failed/passed on this system is a best-guess effort and may not be accurate.';
const UNSUPPORTED_PLURAL_MESSAGE = <React.Fragment>
    <Text variant='p' style={ { marginBottom: '1rem' } }>
        These systems are running unsupported versions of the SCAP Security Guide (SSG) for the version of RHEL installed on them.
        Assessment of rules failed/passed on these systems is a best-guess effort and may not be accurate.
    </Text>
    <Text variant='p'>
        The policy&apos;s compliance score excludes these systems.
    </Text>
</React.Fragment>;

const WarningWithPopover = ({ children, variant = 'plural' }) => {
    const headerContent = 'Unsupported SSG versions';
    const bodyContent = variant === 'plural' ? UNSUPPORTED_PLURAL_MESSAGE : UNSUPPORTED_SINGULAR_MESSAGE;
    const footerContent = <a target='_blank' rel='noopener noreferrer' href={ supportedConfigsLink }>Supported SSG versions</a>;

    return <Popover id='unsupported-popover' maxWidth='25rem'
        { ...{ headerContent, bodyContent, footerContent } } >
        { children }
    </Popover>;
};

WarningWithPopover.propTypes = {
    children: propTypes.node,
    variant: propTypes.oneOf(['singular', 'plural'])
};

const WarningWithTooltip = ({ children, content }) => (
    <Tooltip content={ content } position='bottom'>
        { children }
    </Tooltip>
);

WarningWithTooltip.propTypes = {
    content: propTypes.string,
    children: propTypes.node
};;

const TooltipOrPopover = ({ variant, children, tooltipProps }) => {
    const { Component, componentProps } = {
        tooltip: {
            Component: WarningWithTooltip,
            componentProps: tooltipProps
        },
        popover: {
            Component: WarningWithPopover,
            componentProps: {
                showHeader: tooltipProps.showPopupHeader,
                variant: tooltipProps.messageVariant
            }
        }
    }[variant];

    return <Component { ...componentProps }>
        { children }
    </Component>;
};

TooltipOrPopover.propTypes = {
    children: propTypes.node,
    variant: propTypes.oneOf(['tooltip', 'popover']),
    tooltipProps: propTypes.object
};

const UnsupportedSSGVersion = ({
    children, showWarningIcon = true, showHelpIcon = false, style, tooltipText, messageVariant
}) => {
    const tooltipProps = {
        ...tooltipText && { content: <div>{ tooltipText }</div> },
        messageVariant
    };
    const variant = tooltipText ? 'tooltip' : 'popover';
    const iconProps = {
        variant,
        tooltipProps
    };
    const defaultStyle = !tooltipText ? { cursor: 'pointer' } : {};

    return <span style={ { ...style, display: 'inline-block' } }>
        { showWarningIcon && <TooltipOrPopover { ...iconProps }>
            <ExclamationTriangleIcon
                className='ins-u-warning'
                style={ {
                    ...defaultStyle,
                    marginRight: '.25em'
                } }
            />
        </TooltipOrPopover> }

        { children }

        { showHelpIcon &&  <TooltipOrPopover { ...iconProps }>
            <OutlinedQuestionCircleIcon
                style={ {
                    ...defaultStyle,
                    marginLeft: '.25em'
                } }
            />
        </TooltipOrPopover> }
    </span>;
};

UnsupportedSSGVersion.propTypes = {
    showWarningIcon: propTypes.bool,
    showHelpIcon: propTypes.bool,
    style: propTypes.object,
    tooltipText: propTypes.string,
    children: propTypes.node,
    variant: propTypes.string,
    messageVariant: propTypes.string,
    showPopupHeader: propTypes.bool
};

export default UnsupportedSSGVersion;
