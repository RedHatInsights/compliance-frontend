
## Basic Uses

To show a policy and all it's existing tailorings it requires a `policy`.

```
  <Tailorings
  ouiaId="RHELVersions"
  columns={[
    Columns.Name,
    Columns.Severity,
    Columns.Remediation,
  ]}
  policy={policy}
 />
```

In order to allow adding new tailorings a set of "profiles" can be provided, which will show additional tabs and request rules based on the SSG, profile, major and minor OS version.
**Note:** It will not have any selection for these profiles, this will need to be provided separately.

```
  <Tailorings
    ouiaId="RHELVersions"
    columns={[
      Columns.Name,
      Columns.Severity,
      Columns.Remediation,
    ]}
    policy={policy}
    profiles={[
    {
      osMajorVersion: 9,
      osMinorVersion: 1,
      securityGuideId: 'XYZ-ABC',
      profileId: 'XYZ-ABC',
    },
    {
      osMajorVersion: 9,
      osMinorVersion: 2,
      securityGuideId: 'XYZ-ABC',
      profileId: 'XYZ-ABC',
    },
    ]}
 />
```

It is also possible to only show "profiles", which is used in the "Create Policy" wizard.

```
  <Tailorings
   ouiaId="RHELVersions"
   columns={[
    Columns.Name,
    Columns.Severity,
    Columns.Remediation,
   ]}
   profiles={[
    {
      osMajorVersion: 9,
      osMinorVersion: 1,
      securityGuideId: 'XYZ-ABC',
      profileId: 'XYZ-ABC',
    },
    {
      osMajorVersion: 9,
      osMinorVersion: 2,
      securityGuideId: 'XYZ-ABC',
      profileId: 'XYZ-ABC',
    },
  ]}
 />

```

## Selection

To set a selection for each tab a "selected" object can be provided, where the key can be either an ID of a tailoring, or a OS minor version.

```
 <Tailorings
  ouiaId="RHELVersions"
  columns={[
    Columns.Name,
    Columns.Severity,
    Columns.Remediation,
  ]}
  profiles={[
   {
    osMajorVersion: 9,
    osMinorVersion: 1,
    securityGuideId: 'XYZ-ABC',
    profileId: 'XYZ-ABC',
   },
   {
    osMajorVersion: 9,
    osMinorVersion: 2,
    securityGuideId: 'XYZ-ABC',
    profileId: 'XYZ-ABC',
   },
 ]}
 selected={{
  "2": ['RULE_ID1', 'RULE_ID2']
  "1": ['RULE_ID11', 'RULE_ID5']
 }}
 onSelect={(policy, tailoring, selection) => {
  console.log(policy)
 }}
/>
```

If a `onSelect` callback is provided, it will be called on any selection action with the `policy` as the first parameter, the `tailoring` or an object with the security guide ID and OS minor version as the second parameter, and an array of the selection of the action as a last parameter.

## Providing "Rule values"

The RulesTable will by default show "[Rule values]{@tutorial glossary}" in the details row, if there are any `valueDefinitions` within the rule item for the row.
It will also allow editing the values if a `onValueSave` is provided. It will show/use the `value` of the `valueDefinitions` if there is now changed value aka. value_override.

```
 <Tailorings
  ouiaId="RHELVersions"
  columns={[
    Columns.Name,
    Columns.Severity,
    Columns.Remediation,
  ]}
  profiles={[
    {
      osMajorVersion: 9,
      osMinorVersion: 1,
      securityGuideId: 'XYZ-ABC',
      profileId: 'XYZ-ABC',
    },
    {
      osMajorVersion: 9,
      osMinorVersion: 2,
      securityGuideId: 'XYZ-ABC',
      profileId: 'XYZ-ABC',
    },
  ]}
  selected={{
    "2": ['RULE_ID1', 'RULE_ID2']
    "1": ['RULE_ID11', 'RULE_ID5']
  }}
  onSelect={(policy, tailoring, selection) => {
    console.log(policy, tailoring, selection)
  }}
  onValueSave={(policy, tailoring, valueParameters) => {
    console.log(policy, tailoring, valueParameters)
  }}
  ruleValues={{
    VALUE_DEFINITON_ID: "custom value for defintion",
    SECOND_VALUE_DEFINITON_ID: "another custom value for a defintion"
  }}
/>
```
