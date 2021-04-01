const OsVersionText = ({ profile, newOsMinorVersion }) => (
    `RHEL ${ profile.osMajorVersion }.${ (profile.osMinorVersion || newOsMinorVersion) }`
);

export default OsVersionText;
