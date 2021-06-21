import React from 'react';
import propTypes from 'prop-types';
import { Popover, Tooltip, Text } from '@patternfly/react-core';
import { ExclamationTriangleIcon, OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { SupportedSSGVersionsLink } from 'PresentationalComponents';

export const supportedConfigsLink = 'https://access.redhat.com/documentation/en-us/red_hat_insights/2020-10/' +
    'html/assessing_and_monitoring_security_policy_compliance_of_rhel_systems/' +
    'con-compl-assess-overview_compl-assess-overview#con-compl-assess-supported-configurations_compl-assess-overview';

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

const WarningWithPopover = ({ children, variant = 'plural' }) => (
    <Popover
        id='unsupported-popover'
        maxWidth='25rem'
        headerContent='Unsupported SSG versions'
        bodyContent={ variant === 'plural' ? UNSUPPORTED_PLURAL_MESSAGE : UNSUPPORTED_SINGULAR_MESSAGE }
        footerContent={ <SupportedSSGVersionsLink /> }>
        { children }
    </Popover>
);

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
            <span style={ defaultStyle } className='pf-u-mr-xs'>
                <ExclamationTriangleIcon color='var(--pf-global--warning-color--100)' />
            </span>
        </TooltipOrPopover> }

        { children }

        { showHelpIcon &&  <TooltipOrPopover { ...iconProps }>
            <span style={ defaultStyle } className='pf-u-ml-xs'>
                <OutlinedQuestionCircleIcon />
            </span>
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
