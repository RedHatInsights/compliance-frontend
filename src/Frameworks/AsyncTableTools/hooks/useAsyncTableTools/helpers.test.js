import { toToolbarActions } from './helpers';

describe('toToolbarActions', () => {
  it('returns nothing if no actions are given', () => {
    expect(toToolbarActions({})).toEqual({});
  });

  it('prepends an empty/undefined "firstAction"', () => {
    expect(
      toToolbarActions({
        actions: ['exaple-bogus-action'],
      }).toolbarProps.actionsConfig.actions[0]
    ).toBeUndefined();
  });

  it('it uses the firstAction if set in options', () => {
    const firstAction = () => <>bogus-first-action</>;

    expect(
      toToolbarActions({
        actions: ['example-bogus-action'],
        firstAction,
      }).toolbarProps.actionsConfig.actions[0]
    ).toBeDefined();
  });
});
