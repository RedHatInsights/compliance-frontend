import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { StateView, StateViewPart, StateViewWithError } from './StateView';

describe('StatView', () => {
  it('expect to render loading', () => {
    render(
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

    expect(screen.getByText('LOADING')).toBeInTheDocument();
    expect(screen.queryByText('DATA')).not.toBeInTheDocument();
    expect(screen.queryByText('ERROR')).not.toBeInTheDocument();
  });

  it('expect to render error', () => {
    render(
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

    expect(screen.getByText('ERROR')).toBeInTheDocument();
    expect(screen.queryByText('LOADING')).not.toBeInTheDocument();
    expect(screen.queryByText('DATA')).not.toBeInTheDocument();
  });

  it('expect to render data', () => {
    render(
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

    expect(screen.getByText('DATA')).toBeInTheDocument();
    expect(screen.queryByText('LOADING')).not.toBeInTheDocument();
    expect(screen.queryByText('ERROR')).not.toBeInTheDocument();
  });
});

describe('StatViewWithError', () => {
  it('expect to render error page', () => {
    render(
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

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.queryByText('LOADING')).not.toBeInTheDocument();
    expect(screen.queryByText('DATA')).not.toBeInTheDocument();
  });
});
