const OsVersionText = ({ profile }) => (
    `RHEL ${ profile.osMajorVersion }.${ (profile.osMinorVersion || profile?.benchmark?.latestSupportedOsMinorVersions[0]) }`
);

export default OsVersionText;
