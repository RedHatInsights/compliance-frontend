import { renderHook } from '@testing-library/react';
import { useApolloClient } from '@apollo/client';
import { GET_MINIMAL_SYSTEMS } from '../constants';
import { useFetchSystems } from './useFetchSystems';

jest.mock('@apollo/client');

describe('useFetchSystems', () => {
  const perPage = 10;
  const page = 1;

  const clientQueryMock = jest.fn(() => Promise.resolve({ data: {} }));
  beforeEach(() => {
    useApolloClient.mockImplementation(() => ({
      query: clientQueryMock,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('queries with defaults', () => {
    const { result } = renderHook(() =>
      useFetchSystems({
        query: GET_MINIMAL_SYSTEMS,
      })
    );

    result.current(perPage, page).then(() => {
      expect(clientQueryMock).toHaveBeenCalledWith({
        fetchPolicy: 'no-cache',
        fetchResults: true,
        query: GET_MINIMAL_SYSTEMS,
        variables: {
          page,
          perPage,
        },
      });
    });
  });

  it('queries with a variables and variables from the request call when passed', () => {
    const variables = {
      standardVariable: 'standardVarTest',
    };
    const additionalVariables = {
      customVariable: 'testVar',
    };

    const { result } = renderHook(() =>
      useFetchSystems({
        query: GET_MINIMAL_SYSTEMS,
        variables,
      })
    );

    result.current(perPage, page, additionalVariables).then(() => {
      expect(clientQueryMock).toHaveBeenCalledWith({
        fetchPolicy: 'no-cache',
        fetchResults: true,
        query: GET_MINIMAL_SYSTEMS,
        variables: {
          ...variables,
          ...additionalVariables,
          page,
          perPage,
        },
      });
    });
  });

  it('queries with a request variables over standard variables', () => {
    const variables = {
      page: 1,
      perPage: 10,
    };
    const additionalVariables = {
      perPage: 20,
      page: 4,
    };

    const { result } = renderHook(() =>
      useFetchSystems({
        query: GET_MINIMAL_SYSTEMS,
        variables,
      })
    );

    result.current(perPage, page, additionalVariables).then(() => {
      expect(clientQueryMock).toHaveBeenCalledWith({
        fetchPolicy: 'no-cache',
        fetchResults: true,
        query: GET_MINIMAL_SYSTEMS,
        variables: {
          ...additionalVariables,
        },
      });
    });
  });

  describe('filters', () => {
    const filter = 'id = ID';

    it('queries with a filter from variables when passed', () => {
      const { result } = renderHook(() =>
        useFetchSystems({
          query: GET_MINIMAL_SYSTEMS,
          variables: {
            filter,
          },
        })
      );

      result.current(perPage, page).then(() => {
        expect(clientQueryMock).toHaveBeenCalledWith({
          fetchPolicy: 'no-cache',
          fetchResults: true,
          query: GET_MINIMAL_SYSTEMS,
          variables: {
            filter,
            page,
            perPage,
          },
        });
      });
    });

    it('queries with a filter combined from the standard variables and from variables when passed', () => {
      const requestFilter = 'policy_id = POLICY_ID';

      const { result } = renderHook(() =>
        useFetchSystems({
          query: GET_MINIMAL_SYSTEMS,
          variables: {
            filter,
          },
        })
      );
      result
        .current(perPage, page, {
          filter: requestFilter,
        })
        .then(() => {
          expect(clientQueryMock).toHaveBeenCalledWith({
            fetchPolicy: 'no-cache',
            fetchResults: true,
            query: GET_MINIMAL_SYSTEMS,
            variables: {
              filter: [filter, requestFilter].join(' and '),
              page,
              perPage,
            },
          });
        });
    });

    it('queries with the exclusive filter only when passed', () => {
      const requestFilter = 'policy_id = POLICY_ID';
      const { result } = renderHook(() =>
        useFetchSystems({
          query: GET_MINIMAL_SYSTEMS,
          variables: {
            filter,
          },
        })
      );

      result
        .current(perPage, page, {
          exclusiveFilter: requestFilter,
        })
        .then(() => {
          expect(clientQueryMock).toHaveBeenCalledWith({
            fetchPolicy: 'no-cache',
            fetchResults: true,
            query: GET_MINIMAL_SYSTEMS,
            variables: {
              filter: requestFilter,
              page,
              perPage,
            },
          });
        });
    });
  });
});
