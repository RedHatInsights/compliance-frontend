import React from 'react';
import propTypes from 'prop-types';
import {
  Form,
  FormGroup,
  Text,
  TextArea,
  Checkbox,
} from '@patternfly/react-core';

const ExportPDFForm = ({ policy, setExportSetting, exportSettings }) => (
  <Form>
    <FormGroup isInline fieldId="simple-form-checkbox-group" label="Policy">
      <Text>{policy.name}</Text>
    </FormGroup>

    <FormGroup
      fieldId="simple-form-checkbox-group"
      label="System data to include"
    >
      <Checkbox
        label="Non-compliant systems"
        id="non-compliant-systems-export-setting"
        aria-label="Non-compliant systems"
        onChange={(e) =>
          setExportSetting('nonCompliantSystems')(e.target.checked)
        }
        isChecked={exportSettings.nonCompliantSystems}
      />
      <Checkbox
        label="Systems with unsupported configuration"
        id="unsupported-systems-export-setting"
        aria-label="Systems with unsupported configuration"
        onChange={(e) =>
          setExportSetting('unsupportedSystems')(e.target.checked)
        }
        isChecked={exportSettings.unsupportedSystems}
      />
      <Checkbox
        label="Systems with no reports"
        id="nonreporting-systems-export-setting"
        aria-label="Systems never reported"
        onChange={(e) =>
          setExportSetting('nonReportingSystems')(e.target.checked)
        }
        isChecked={exportSettings.nonReportingSystems}
      />
      <Checkbox
        id="compliant-systems-export-setting"
        onChange={(e) => setExportSetting('compliantSystems')(e.target.checked)}
        isChecked={exportSettings.compliantSystems}
        label="Compliant systems"
        aria-label="Compliant systems"
      />
    </FormGroup>

    <FormGroup label="Rule data to include" fieldId="checkbox01">
      <Checkbox
        id="failed-rules-export-setting"
        label="Top failed rules (Up to 10)"
        aria-label="Rule data to include"
        onChange={(e) =>
          setExportSetting('topTenFailedRules')(e.target.checked)
        }
        isChecked={exportSettings.topTenFailedRules}
      />
    </FormGroup>

    <FormGroup label="User notes (optional)" fieldId="checkbox01">
      <TextArea
        aria-label="User notes (optional)"
        onChange={(e) => setExportSetting('userNotes')(e.target.value)}
        value={exportSettings.userNotes}
      />
    </FormGroup>
  </Form>
);

ExportPDFForm.propTypes = {
  policy: propTypes.object,
  exportSettings: propTypes.object,
  setExportSetting: propTypes.func,
};

export default ExportPDFForm;
