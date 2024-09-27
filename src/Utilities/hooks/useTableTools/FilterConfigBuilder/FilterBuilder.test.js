import FilterConfigBuilder from './FilterConfigBuilder';
import FilterBuilder from './FilterBuilder';
import { exampleFilters } from '../__fixtures__/filters';
import {
  compliantSystemFilterConfiguration,
  COMPLIANT_SYSTEM_FILTER_CONFIG_KEYS_GRAPHQL,
} from '@/constants';

describe('buildFilterString', () => {
  const configBuilder = new FilterConfigBuilder(exampleFilters);
  let filterBuilder;

  beforeEach(() => {
    filterBuilder = new FilterBuilder(configBuilder);
  });

  it('returns a filterstring', () => {
    const exampleActiveFilters = {
      name: 'Name',
      compliance: [true],
      compliancescore: ['0-49', '50-69'],
    };

    expect(
      filterBuilder.buildFilterString(exampleActiveFilters)
    ).toMatchSnapshot();
  });

  describe('filter building', () => {
    it('returns a base filter for name when searching', () => {
      const testExampleState = {
        name: 'Name',
      };
      expect(
        filterBuilder.buildFilterString(testExampleState)
      ).toMatchSnapshot();
    });

    it('returns a filter for compliant', () => {
      const testExampleState = {
        compliance: [true],
      };
      expect(
        filterBuilder.buildFilterString(testExampleState)
      ).toMatchSnapshot();
    });

    it('returns a filter for scores', () => {
      const testExampleState = {
        systemsmeetingcompliance: ['0-49', '50-69'],
      };
      expect(
        filterBuilder.buildFilterString(testExampleState)
      ).toMatchSnapshot();
    });
  });

  describe('builds filters from constants in use: ', () => {
    it('compliantSystemFilterConfiguration GraphQL', () => {
      let builder = new FilterBuilder(
        new FilterConfigBuilder(
          compliantSystemFilterConfiguration(
            COMPLIANT_SYSTEM_FILTER_CONFIG_KEYS_GRAPHQL
          )
        )
      );

      expect(
        builder.buildFilterString({
          compliancescore: ['0-50', '50-70'],
        })
      ).toEqual(
        '(compliance_score >= 0 and compliance_score < 50) or (compliance_score >= 50 and compliance_score < 70)'
      );

      expect(
        builder.buildFilterString({
          compliancescore: ['90-101', '70-90'],
          compliance: ['compliant=true'],
        })
      ).toEqual(
        'compliant=true and (compliance_score >= 90 and compliance_score < 101) or (compliance_score >= 70 and compliance_score < 90)'
      );
    });

    it('compliantSystemFilterConfiguration Rest', () => {
      let builder = new FilterBuilder(
        new FilterConfigBuilder(compliantSystemFilterConfiguration())
      );

      expect(
        builder.buildFilterString({
          compliancescore: ['0-50', '50-70'],
        })
      ).toEqual('(score >= 0 and score < 50) or (score >= 50 and score < 70)');

      expect(
        builder.buildFilterString({
          compliancescore: ['90-101', '70-90'],
          compliance: ['compliant=true'],
        })
      ).toEqual(
        'compliant=true and (score >= 90 and score < 101) or (score >= 70 and score < 90)'
      );
    });
  });
});
