import { render } from '@testing-library/react';
import { StateView, StateViewPart, StateViewWithError } from './StateView';

describe('StatView', () => {
  it('expect to render loading', () => {
    const { asFragment } = render(
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

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render error', () => {
    const { asFragment } = render(
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

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render data', () => {
    const { asFragment } = render(
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

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('StatViewWithError', () => {
  it('expect to render error page', () => {
    const { asFragment } = render(
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

    expect(asFragment()).toMatchSnapshot();
  });
});
