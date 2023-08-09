import React from 'react';
import PolicyMultiversionRules from './PolicyMultiversionRules';
import { IntlProvider } from 'react-intl';

import { MemoryRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { Provider } from 'react-redux';
import { COMPLIANCE_API_ROOT } from '@/constants';
import { init } from 'Store';
import fixtures from '../../../cypress/fixtures/policyMultiversionRules.json';

const client = new ApolloClient({
  link: new HttpLink({
    credentials: 'include',
    uri: COMPLIANCE_API_ROOT + '/graphql',
  }),
  cache: new InMemoryCache(),
});
const mountComponent = () => {
  cy.mount(
    <Provider store={init().getStore()}>
      <IntlProvider locale={navigator.language}>
        <MemoryRouter>
          <ApolloProvider client={client}>
            <PolicyMultiversionRules
              policy={fixtures}
              saveToPolicy={() => {}}
              onRuleValueReset={() => {}}
            />
          </ApolloProvider>
        </MemoryRouter>
      </IntlProvider>
    </Provider>
  );
};

const profiles = Object.assign([], fixtures['policy']['profiles']);
const hosts = Object.assign([], fixtures['hosts']);
const firstProfile = profiles[0];
const firstProfileOsVersion = `${firstProfile['osMajorVersion']}.${firstProfile['osMinorVersion']}`;
const secondProfile = profiles[1];
const secondProfileOsVersion = `${secondProfile['osMajorVersion']}.${secondProfile['osMinorVersion']}`;

describe('Policy multiversion rules table tests', () => {
  beforeEach(() => {
    mountComponent();
  });
  describe('defaults', () => {
    it('Tree and List tables render', () => {
      cy.get('table').should('have.length', 2);
    });
  });

  describe('Tabs tests', () => {
    it('Switching between rule tabs', () => {
      let firstProfileSystemsNum = 0;
      let secondProfileSystemNum = 0;
      hosts.forEach((host) => {
        if (host['osMinorVersion'] == firstProfile['osMinorVersion']) {
          firstProfileSystemsNum++;
        } else {
          secondProfileSystemNum++;
        }
      });

      cy.ouiaId(`RHEL ${firstProfileOsVersion}`, 'button').click();
      cy.get('section > section:not([hidden])')
        .ouiaId('SSGVersion')
        .should(
          'contain.text',
          `SSG version: ${firstProfile['benchmark']['version']}`
        );
      expect(
        cy
          .get('section > section:not([hidden])')
          .ouiaId('RHELVersionWithBadge')
          .contains(`${firstProfileOsVersion}${firstProfileSystemsNum} system`)
      );

      cy.ouiaId(`RHEL ${secondProfileOsVersion}`, 'button').click();
      cy.get('section > section:not([hidden])')
        .ouiaId('SSGVersion')
        .should(
          'contain.text',
          `SSG version: ${secondProfile['benchmark']['version']}`
        );
      expect(
        cy
          .get('section > section:not([hidden])')
          .ouiaId('RHELVersionWithBadge')
          .contains(`${secondProfileOsVersion}${secondProfileSystemNum} system`)
      );
    });
  });

  describe('Filter table', () => {
    it('Searching by rule name switches tables', () => {
      cy.get('section > section:not([hidden])').within(() => {
        cy.get('button[aria-label="tree"]').should(
          'have.attr',
          'aria-pressed',
          'true'
        );
        cy.ouiaId('ConditionalFilter', 'input').type('Foo bar');
        cy.get('button[aria-label="list"]').should(
          'have.attr',
          'aria-pressed',
          'true'
        );
        cy.get('button[aria-label="tree"]').should(
          'have.attr',
          'aria-pressed',
          'false'
        );
      });
    });

    it('Search by non existing name', () => {
      cy.get('section > section:not([hidden])').within(() => {
        cy.ouiaId('ConditionalFilter', 'input').type('Foo bar');
        cy.get('div[class="pf-c-empty-state"]')
          .contains('No matching rules found')
          .should('exist');
      });
    });

    it('Find rule by Name', () => {
      const firstRule = firstProfile['rules'][0];
      cy.get('section > section:not([hidden])').within(() => {
        cy.ouiaId('ConditionalFilter', 'input').type(firstRule['title']);
        cy.get('td[data-label="Name"] > div')
          .should('have.length', 1)
          .first()
          .contains(firstRule['title']);
      });
    });

    it('Filter rules by Severity', () => {
      cy.get('section > section:not([hidden])').within(() => {
        cy.get('button[aria-label="list"]').click();

        cy.ouiaId('ConditionalFilter', 'button').click();
        cy.ouiaId('Severity', 'button').click();
        cy.ouiaId('Filter by severity', 'div').click();
        cy.get('input[id$="high"]').click();
        cy.ouiaId('Filter by severity', 'div').click();
        cy.get('td[data-label="Severity"]').each(($rowSevValue) => {
          cy.wrap($rowSevValue).should('include.text', 'High');
        });
        cy.ouiaId('ClearFilters', 'button').should('be.visible').click();

        cy.ouiaId('ConditionalFilter', 'button').click();
        cy.ouiaId('Severity', 'button').click();
        cy.ouiaId('Filter by severity', 'div').click();
        cy.get('input[id$="medium"]').click();
        cy.ouiaId('Filter by severity', 'div').click();
        cy.get('td[data-label="Severity"]').each(($rowSevValue) => {
          cy.wrap($rowSevValue).should('include.text', 'Medium');
        });
        cy.ouiaId('ClearFilters', 'button').should('be.visible').click();

        cy.ouiaId('ConditionalFilter', 'button').click();
        cy.ouiaId('Severity', 'button').click();
        cy.ouiaId('Filter by severity', 'div').click();
        cy.get('input[id$="low"]').click();
        cy.ouiaId('Filter by severity', 'div').click();
        cy.get('td[data-label="Severity"]').each(($rowSevValue) => {
          cy.wrap($rowSevValue).should('include.text', 'Low');
        });
        cy.ouiaId('ClearFilters', 'button').should('be.visible').click();

        cy.ouiaId('ConditionalFilter', 'button').click();
        cy.ouiaId('Severity', 'button').click();
        cy.ouiaId('Filter by severity', 'div').click();
        cy.get('input[id$="unknown"]').click();
        cy.ouiaId('Filter by severity', 'div').click();
        cy.get('div[class="pf-c-empty-state"]')
          .contains('No matching rules found')
          .should('exist');
        cy.ouiaId('ClearFilters', 'button').should('be.visible').click();
      });
    });

    it('Filter rules by Ansible support', () => {
      cy.get('section > section:not([hidden])').within(() => {
        cy.get('button[aria-label="list"]').click();

        cy.ouiaId('ConditionalFilter', 'button').click();
        cy.ouiaId('Ansible support', 'button').click();
        cy.ouiaId('Filter by ansible support', 'div').click();
        cy.get('input[id$="true"]').click();
        cy.ouiaId('Filter by ansible support', 'div').click();
        cy.get('td[data-label="Remediation"]').each(($rowSevValue) => {
          cy.wrap($rowSevValue).should('include.text', 'Playbook');
        });
        cy.ouiaId('ClearFilters', 'button').should('be.visible').click();

        cy.ouiaId('ConditionalFilter', 'button').click();
        cy.ouiaId('Ansible support', 'button').click();
        cy.ouiaId('Filter by ansible support', 'div').click();
        cy.get('input[id$="false"]').click();
        cy.ouiaId('Filter by ansible support', 'div').click();
        cy.get('td[data-label="Remediation"]').each(($rowSevValue) => {
          cy.wrap($rowSevValue).should('include.text', 'Manual');
        });
        cy.ouiaId('ClearFilters', 'button').should('be.visible').click();
      });
    });

    it('Clear filters works', () => {
      cy.get('section > section:not([hidden])').within(() => {
        cy.ouiaId('ConditionalFilter', 'input').type('Foo bar');
        cy.ouiaId('ClearFilters', 'button').should('be.visible').click();
        cy.ouiaId('ClearFilters', 'button').should('not.exist');
      });
    });
  });

  describe('Manage columns', () => {
    it('Manage reports columns', () => {
      cy.get('section > section:not([hidden])').within(() => {
        cy.ouiaId('Actions', 'div').click();
        cy.ouiaType('PF4/DropdownItem', 'button').click();
      });

      cy.get('input[checked]')
        .not('[disabled]')
        .each(($checkbox) => {
          cy.wrap($checkbox).click();
        });
      cy.ouiaId('Save', 'button').click();

      cy.get('section > section:not([hidden])').within(() => {
        cy.get('th[data-label="Severity"]').should('not.exist');
        cy.get('th[data-label="Remediation"]').should('not.exist');
        cy.ouiaId('Actions', 'div').click();
        cy.ouiaType('PF4/DropdownItem', 'button').click();
      });

      cy.get('button').contains('Select all').click();
      cy.ouiaId('Save', 'button').click();

      cy.get('section > section:not([hidden])').within(() => {
        cy.get('th[data-label="Severity"]').should('exist');
        cy.get('th[data-label="Remediation"]').should('exist');
      });
    });
  });

  describe.skip('table column filtering', () => {
    it('Sort by Name', () => {
      let ruleNames = [];
      const rules = secondProfile['rules'];

      rules.forEach((item) => {
        ruleNames.push(item['title']);
      });
      const ascendingSorted = [...ruleNames].sort();

      const descendingSorted = [...ruleNames].sort().reverse();

      cy.get('section > section:not([hidden])').within(() => {
        cy.get('button[aria-label="list"]').click();
        // enable ascending order
        cy.get('th[data-label="Name"] > button').click();
        cy.get('th[data-label="Name"]')
          .invoke('attr', 'aria-sort')
          .should('eq', 'ascending');
        cy.get('td[data-label="Name"] > div').each((item, index) => {
          cy.wrap(item).should('include.text', ascendingSorted[index]);
        });

        // enable descending order
        cy.get('th[data-label="Name"] > button').click();
        cy.get('th[data-label="Name"]')
          .invoke('attr', 'aria-sort')
          .should('eq', 'descending');
        cy.get('td[data-label="Name"] > div').each((item, index) => {
          cy.wrap(item).should('include.text', descendingSorted[index]);
        });
      });
    });
  });

  describe('Reports download', () => {
    it('CSV report download and content', () => {
      cy.ouiaId(`RHEL ${firstProfileOsVersion}`, 'button').click();
      cy.get('section > section:not([hidden])').within(() => {
        cy.ouiaId('Export', 'button').click();
        cy.ouiaId('DownloadCSV', 'button').click();
        // get the newest csv file
        cy.exec('ls cypress/downloads | grep .csv | sort -n | tail -1').then(
          function (result) {
            let res = result.stdout;
            cy.readFile('cypress/downloads/' + res).should('not.be.empty');
          }
        );
      });
    });

    it('JSON report download and content', () => {
      const rules = firstProfile['rules'];
      cy.ouiaId(`RHEL ${firstProfileOsVersion}`, 'button').click();
      cy.get('section > section:not([hidden])').within(() => {
        cy.ouiaId('Export', 'button').click();
        cy.ouiaId('DownloadJSON', 'button').click();
        // get the newest json file
        cy.exec('ls cypress/downloads | grep .json | sort -n | tail -1').then(
          function (result) {
            let res = result.stdout;
            cy.readFile('cypress/downloads/' + res)
              .should('not.be.empty')
              .then((fileContent) => {
                assert(
                  fileContent.length === rules.length,
                  'Length of rules is different'
                );
                fileContent.forEach((fileItem) => {
                  rules.forEach((rule) => {
                    if (fileItem['Name'].includes(rule['title'])) {
                      assert(
                        rule['severity'] == fileItem['Severity'],
                        `Severity are not identical: JSON has ${fileItem['Severity']} while value has to be ${rule['severity']}`
                      );
                      if (rule['remediationAvailable']) {
                        assert(
                          fileItem['Remediation'] == 'Playbook',
                          `Remediation values are not identical: JSON has ${fileItem['Remediation']} while value has to be Playbook`
                        );
                      } else {
                        assert(
                          fileItem['Remediation'] == 'Manual',
                          `Remediation values are not identical: JSON has ${fileItem['Remediation']} while value has to be Manual`
                        );
                      }
                    }
                  });
                });
              });
          }
        );
      });
    });
  });

  describe('Tree table tests', () => {
    it('Tree table content when expanded', () => {
      cy.ouiaId(`RHEL ${firstProfileOsVersion}`, 'button').click();

      function expandTableTree() {
        cy.get('section > section:not([hidden])').then(($mainContainer) => {
          const isVisible = $mainContainer
            .find('button[aria-expanded="false"][aria-label^="Expand row"]')
            .is(':visible');
          if (isVisible) {
            $mainContainer
              .find('button[aria-expanded="false"][aria-label^="Expand row"]')
              .first()
              .trigger('click');
            expandTableTree();
          }
        });
      }

      expandTableTree();
      const expectedTree = [
        'Services',
        'Network Time Protocol',
        'Specify Additional Remote NTP Servers',
        'Description',
        'Specify a Remote NTP Server',
        'Description',
        'Enable the NTP Daemon',
        'Description',
        'SSH Server',
        'Configure OpenSSH Server if Necessary',
        'Set SSH Idle Timeout Interval',
        'Description',
      ];
      cy.get('section > section:not([hidden])').within(() => {
        cy.get('table').should('have.length', 1);
        cy.get('tbody')
          .ouiaType('PF4/TableRow', 'tr')
          .each((item, index) => {
            cy.wrap(item).should('include.text', expectedTree[index]);
          });
      });
    });
  });
  describe('List table tests', () => {
    it('Content of expanded rule', () => {
      cy.ouiaId(`RHEL ${firstProfileOsVersion}`, 'button').click();
      const firstRule = firstProfile['rules'][0];
      cy.get('section > section:not([hidden])').within(() => {
        cy.get('button[aria-label="list"]').click();
        cy.ouiaId('ConditionalFilter', 'input').type(firstRule['title']);
        cy.get('td[data-label="Name"] > div')
          .should('have.length', 1)
          .first()
          .contains(firstRule['title']);
        cy.get('button[aria-expanded="false"][aria-label^="Details"]').click();

        cy.get('div[id^="rule-description"]').should(
          'include.text',
          firstRule['description']
        );
        cy.get('div[id^="rule-identifiers-references"]').should(
          'include.text',
          firstRule['identifier']['label']
        );

        let refs = '';
        firstRule['references'].forEach((ref) => {
          refs = refs + `${ref['label']}, `;
        });
        refs = refs.slice(0, -2).trim();

        cy.get('div[id^="rule-identifiers-references"]').should(
          'include.text',
          refs
        );
        cy.get('div[id^="rule-rationale"]').should(
          'include.text',
          firstRule['rationale']
        );
      });
    });
  });
});
