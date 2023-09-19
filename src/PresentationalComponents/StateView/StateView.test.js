import { render } from '@testing-library/react';
import { queryByText } from '@testing-library/dom';

import { StateView, StateViewPart, StateViewWithError } from './StateView';

describe('StatView', () => {
  it('expect to render loading', () => {
    const { container } = render(
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

    expect(queryByText(container, 'LOADING')).not.toBeNull();
    expect(queryByText(container, 'DATA')).toBeNull();
    expect(queryByText(container, 'ERROR')).toBeNull();
  });

  it('expect to render error', () => {
    const { container } = render(
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

    expect(queryByText(container, 'ERROR')).not.toBeNull();
    expect(queryByText(container, 'LOADING')).toBeNull();
    expect(queryByText(container, 'DATA')).toBeNull();
  });

  it('expect to render data', () => {
    const { container } = render(
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

    expect(queryByText(container, 'DATA')).not.toBeNull();
    expect(queryByText(container, 'LOADING')).toBeNull();
    expect(queryByText(container, 'ERROR')).toBeNull();
  });
});

describe('StatViewWithError', () => {
  it('expect to render error page', () => {
    const { container } = render(
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

    expect(
      queryByText(
        container,
        'There was a problem processing the request. Please try again.'
      )
    ).not.toBeNull();
    expect(queryByText(container, 'LOADING')).toBeNull();
    expect(queryByText(container, 'DATA')).toBeNull();
  });
});
