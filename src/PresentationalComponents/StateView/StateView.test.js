import { StateView, StateViewPart, StateViewWithError } from './StateView';

describe('StatView', () => {
  it('expect to render loading', () => {
    const wrapper = shallow(
      <StateView
        stateValues={{
          loading: true,
          data: undefined,
          error: undefined,
        }}
      >
        <StateViewPart stateKey="loading">LOADING</StateViewPart>
        <StateViewPart stateKey="data">DATA</StateViewPart>
        <StateViewPart stateKey="error">ERROR</StateViewPart>
      </StateView>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('expect to render error', () => {
    const wrapper = shallow(
      <StateView
        stateValues={{
          loading: undefined,
          error: { error: 'ERROR' },
          data: undefined,
        }}
      >
        <StateViewPart stateKey="loading">LOADING</StateViewPart>
        <StateViewPart stateKey="data">DATA</StateViewPart>
        <StateViewPart stateKey="error">ERROR</StateViewPart>
      </StateView>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('expect to render data', () => {
    const wrapper = shallow(
      <StateView
        stateValues={{
          loading: undefined,
          error: undefined,
          data: { data: 'data' },
        }}
      >
        <StateViewPart stateKey="loading">LOADING</StateViewPart>
        <StateViewPart stateKey="data">DATA</StateViewPart>
        <StateViewPart stateKey="error">ERROR</StateViewPart>
      </StateView>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('StatViewWithError', () => {
  it('expect to render error page', () => {
    const wrapper = shallow(
      <StateViewWithError
        stateValues={{
          loading: undefined,
          error: { error: 'ERROR' },
          data: undefined,
        }}
      >
        <StateViewPart stateKey="loading">LOADING</StateViewPart>
        <StateViewPart stateKey="data">DATA</StateViewPart>
      </StateViewWithError>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
