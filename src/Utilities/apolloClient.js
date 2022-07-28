import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';

import { COMPLIANCE_API_ROOT } from '@/constants';

const client = new ApolloClient({
  link: new HttpLink({
    credentials: 'include',
    uri: COMPLIANCE_API_ROOT + '/graphql',
  }),
  cache: new InMemoryCache(),
});

export default client;
