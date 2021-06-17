const OsVersionText = ({ profile, newOsMinorVersion }) =>
  `RHEL${'\u00A0'}${profile.osMajorVersion}.${
    profile.osMinorVersion || newOsMinorVersion
  }`;

export default OsVersionText;
