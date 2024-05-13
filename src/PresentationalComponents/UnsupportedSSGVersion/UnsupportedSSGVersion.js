import React from 'react';
import propTypes from 'prop-types';
import { Popover, Tooltip, Text, Icon } from '@patternfly/react-core';
import {
  ExclamationTriangleIcon,
  OutlinedQuestionCircleIcon,
} from '@patternfly/react-icons';
import { SupportedSSGVersionsLink } from 'PresentationalComponents';

const UNSUPPORTED_SINGULAR_MESSAGE =
  'This system was using an incompatible version of the SSG at the time this report was generated. ' +
  'Assessment of rules failed/passed on this system is a best-guess effort and may not be accurate.';

const UnsupportedPluralMessage = () => (
  <React.Fragment>
    <Text variant="p" style={{ marginBottom: '1rem' }}>
      These systems are running unsupported versions of the SCAP Security Guide
      (SSG) for the version of RHEL installed on them. Assessment of rules
      failed/passed on these systems is a best-guess effort and may not be
      accurate.
    </Text>
    <Text variant="p">
      The policy&apos;s compliance score excludes these systems.
    </Text>
  </React.Fragment>
);

const WarningWithPopover = ({ children, variant = 'plural' }) => (
  <Popover
    id="unsupported-popover"
    maxWidth="25rem"
    headerContent="Unsupported SSG versions"
    bodyContent={
      variant === 'plural' ? (
        <UnsupportedPluralMessage />
      ) : (
        UNSUPPORTED_SINGULAR_MESSAGE
      )
    }
    footerContent={<SupportedSSGVersionsLink />}
  >
    {children}
  </Popover>
);

WarningWithPopover.propTypes = {
  children: propTypes.node,
  variant: propTypes.oneOf(['singular', 'plural']),
};

const WarningWithTooltip = ({ children, content }) => (
  <Tooltip content={content} position="bottom">
    {children}
  </Tooltip>
);

WarningWithTooltip.propTypes = {
  content: propTypes.node,
  children: propTypes.node,
};

const TooltipOrPopover = ({ variant, children, tooltipProps }) => {
  const { Component, componentProps } = {
    tooltip: {
      Component: WarningWithTooltip,
      componentProps: tooltipProps,
    },
    popover: {
      Component: WarningWithPopover,
      componentProps: {
        showHeader: tooltipProps.showPopupHeader,
        variant: tooltipProps.messageVariant,
      },
    },
  }[variant];

  return <Component {...componentProps}>{children}</Component>;
};

TooltipOrPopover.propTypes = {
  children: propTypes.node,
  variant: propTypes.oneOf(['tooltip', 'popover']),
  tooltipProps: propTypes.object,
};

const UnsupportedSSGVersion = ({
  children,
  showWarningIcon = true,
  showHelpIcon = false,
  tooltipText,
  messageVariant,
}) => {
  const tooltipProps = {
    ...(tooltipText && { content: <div>{tooltipText}</div> }),
    messageVariant,
  };
  const variant = tooltipText ? 'tooltip' : 'popover';
  const iconProps = {
    variant,
    tooltipProps,
  };
  const defaultStyle = !tooltipText ? { cursor: 'pointer' } : {};

  return (
    <span
      aria-label="Unsupported SSG Version warning"
      style={{ display: 'inline-block' }}
    >
      {showWarningIcon && (
        <TooltipOrPopover {...iconProps}>
          <Icon
            style={defaultStyle}
            className="pf-v5-u-mr-xs"
            aria-label={tooltipText ? 'Tooltip icon' : 'Popover icon'}
            status="warning"
            isInline
          >
            <ExclamationTriangleIcon />
          </Icon>
        </TooltipOrPopover>
      )}

      {children}

      {showHelpIcon && (
        <TooltipOrPopover {...iconProps}>
          <Icon
            aria-label="Help icon"
            style={defaultStyle}
            className="pf-v5-u-ml-xs grey-icon"
            isInline
          >
            <OutlinedQuestionCircleIcon className="" />
          </Icon>
        </TooltipOrPopover>
      )}
    </span>
  );
};

UnsupportedSSGVersion.propTypes = {
  showWarningIcon: propTypes.bool,
  showHelpIcon: propTypes.bool,
  style: propTypes.object,
  tooltipText: propTypes.string,
  children: propTypes.node,
  variant: propTypes.string,
  messageVariant: propTypes.string,
  showPopupHeader: propTypes.bool,
};

export default UnsupportedSSGVersion;
