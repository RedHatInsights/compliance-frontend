import React from 'react';
import propTypes from 'prop-types';
// import { Text } from '@react-pdf/renderer';
// eslint-disable-next-line
import { Chart, Paragraph, PanelItem, Panel, Table, Column, Section } from '@redhat-cloud-services/frontend-components-pdf-generator';

const identifierLabel = ({ identifier }) =>
  JSON.parse(identifier || '{}').label || '';

const capitalize = (str = '') => str.charAt(0).toUpperCase() + str.slice(1);

const RulesTable = ({ rules }) => {
  const headerRow = ['Rule name', 'ID', 'Severity', 'Failed systems'];
  const failedRuleRows = rules.map((rule) => [
    rule.title,
    identifierLabel(rule),
    // TODO: Add icon svg for severity
    capitalize(rule?.severity),
    `${rule.systemCount}`,
  ]);
  console.log(rules, failedRuleRows);
  return <Table withHeader rows={[headerRow, ...failedRuleRows]} />;
};

RulesTable.propTypes = {
  rules: propTypes.array,
};

export default RulesTable;
