const buildBaseFilter = (state) => {
    const { policyId } = state;
    const name = state.activeFilters ? state.activeFilters.name : [];

    let additionalFilter = [];

    if (policyId && policyId.length > 0) {
        additionalFilter.push(`profile_id = ${policyId}`);
    }

    if (name && name.length > 0) {
        additionalFilter.push(`name ~ ${name}`);
    }

    return [additionalFilter.join(' and ')].filter((f) => (f.length > 0));
};

export const buildFilterString = (state) => {
    const additionalFilter = buildBaseFilter(state);
    const { compliant: complianceStates, compliancescore: complianceScores } = (state.activeFilters || {});
    const compliant = complianceStates ? complianceStates.map((compliant) =>
        `compliant = ${compliant}`
    ) : [];
    const complianceScore = complianceScores ? complianceScores.map((scoreRange) => {
        scoreRange = scoreRange.split('-');
        return `compliance_score >= ${scoreRange[0]} and compliance_score <= ${scoreRange[1]}`;
    }) : [];
    const filters = [
        additionalFilter,
        compliant,
        complianceScore
    ].filter((f) => (f.length > 0));
    const moreThanTwo = filters.map((f) => (f.length)).filter((fl) => (fl > 0)).length >= 2;

    return filters.map((fs) => (fs.join(' or '))).join(moreThanTwo ? ' and ' : '');
};
