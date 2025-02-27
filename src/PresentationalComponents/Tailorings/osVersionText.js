const OsVersionText = ({ profile, newOsMinorVersion }) =>
  `RHEL ${profile.osMajorVersion}.${
    profile.osMinorVersion !== null ? profile.osMinorVersion : newOsMinorVersion
  }`;

export default OsVersionText;
