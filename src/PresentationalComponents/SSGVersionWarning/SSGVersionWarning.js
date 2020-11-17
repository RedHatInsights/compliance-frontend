import React from 'react';
import propTypes from 'prop-types';
import { Popover, Tooltip } from '@patternfly/react-core';
import { ExclamationTriangleIcon, QuestionCircleIcon } from '@patternfly/react-icons';

const WarningSignWithPopup = ({ children }) => (
    <Popover
        headerContent={ 'Unsupported SSG versions' }
        bodyContent={
            'This system is running an unsupported version of the SCAP Security Guide (SSG).' +
            'This information is based on the last report uploaded for this system to the Compliance service.'
        }
        footerContent={
            <a href="#">Supported SSG versions</a>
        }
    >
        { children }
    </Popover>
);
WarningSignWithPopup.propTypes = {
    children: propTypes.node
};;

const WarningWithTooltip = ({ children, content }) => (
    <Tooltip content={ content } position='bottom'>
        { children }
    </Tooltip>
);

WarningWithTooltip.propTypes = {
    content: propTypes.string,
    children: propTypes.node
};;

const TooltipOrPopover = ({ variant, children, tooltipProps }) => (
    variant === 'tooltip' ? <WarningWithTooltip { ...tooltipProps }>
        { children }
    </WarningWithTooltip> : <WarningSignWithPopup>{ children }</WarningSignWithPopup>
);

TooltipOrPopover.propTypes = {
    children: propTypes.node,
    variant: propTypes.string,
    tooltipProps: propTypes.object
};

const SSGVersionWarning = ({
    showWarningIcon = true, showHelpIcon = false, children, style, tooltipText, supported = true
}) => {
    const tooltipProps = {
        content: <div>{ tooltipText }</div>
    };
    const variant = tooltipText ? 'tooltip' : 'popover';
    const iconProps = {
        variant,
        tooltipProps
    };
    const defaultStyle = {
        ...!tooltipText ? {
            cursor: 'pointer'
        } : {}
    };

    return <span style={ {
        ...style,
        display: 'inline-block'
    }}>
        { (!supported && showWarningIcon) && <TooltipOrPopover { ...iconProps }>
            <ExclamationTriangleIcon
                className='ins-u-warning'
                style={ {
                    ...defaultStyle,
                    marginRight: '.25em'
                } }
            />
        </TooltipOrPopover> }

        { children }

        { (!supported && showHelpIcon) &&  <TooltipOrPopover { ...iconProps }>
            <QuestionCircleIcon
                style={ {
                    ...defaultStyle,
                    marginLeft: '.25em'
                } }
            />
        </TooltipOrPopover> }
    </span>;
};

SSGVersionWarning.propTypes = {
    children: propTypes.node,
    tooltipText: propTypes.string,
    showHelpIcon: propTypes.bool,
    showWarningIcon: propTypes.bool,
    style: propTypes.object,
    supported: propTypes.bool
};

export default SSGVersionWarning;
