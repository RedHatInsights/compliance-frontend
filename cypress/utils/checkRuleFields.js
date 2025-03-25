const checkRuleFields = (rule, values) => {
  // Check rule description
  cy.get('div[id^="rule-description-rule"]')
    .should('exist')
    .invoke('text')
    .should('contain', rule.description);

  // Check rule identifiers and references
  cy.get('div[id^="rule-identifiers-references"]')
    .should('exist')
    .invoke('text')
    .then((text) => {
      expect(text).to.include(rule.identifier.label);
      expect(text).to.include(rule.references[0].label);
    });

  // Check rule rationale
  cy.get('div[id^="rule-rationale"]')
    .should('exist')
    .invoke('text')
    .should('contain', rule.rationale);

  values?.forEach(({ title, default_value }) => {
    cy.contains('div', 'Depends on values')
      .parent() // Move to the parent container and get <p> child element
      .within(() => {
        cy.get('p').should(
          'contain.text',
          `${title}: ${default_value}`
        );
      });
  });
};

export default checkRuleFields;
