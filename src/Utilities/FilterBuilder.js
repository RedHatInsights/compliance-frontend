const buildBaseFilter = (state) => {
    const { policyId, search } = state;
    let additionalFilter = [];

    if (policyId.length > 0) {
        additionalFilter.push(`profile_id = ${policyId}`);
    }

    if (search.length > 0) {
        additionalFilter.push(`name ~ ${search}`);
    }

    return [additionalFilter.join(' and ')].filter((f) => (f.length > 0));
};

export const buildFilterString = (state) => {
    const additionalFilter = buildBaseFilter(state);
    const { complianceStates, complianceScores } = state.activeFilters;
    const compliant = complianceStates.map((compliant) =>
        `compliant = ${compliant}`
    );
    const complianceScore = complianceScores.map((scoreRange) => {
        scoreRange = scoreRange.split('-');
        return `compliance_score >= ${scoreRange[0]} and compliance_score <= ${scoreRange[1]}`;
    });
    const filters = [
        additionalFilter,
        compliant,
        complianceScore
    ].filter((f) => (f.length > 0));
    const moreThanTwo = filters.map((f) => (f.length)).filter((fl) => (fl > 0)).length >= 2;

    return filters.map((fs) => (fs.join(' or '))).join(moreThanTwo ? ' and ' : '');
};
