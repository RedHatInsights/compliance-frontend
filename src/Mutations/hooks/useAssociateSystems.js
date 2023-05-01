import { useMutation } from '@apollo/client';
import { ASSOCIATE_SYSTEMS_TO_PROFILES } from '../graphql/mutations';

const useAssociateSystems = () => {
  const [associateSystems] = useMutation(ASSOCIATE_SYSTEMS_TO_PROFILES);

  return async ({ id }, hosts) => {
    const { data, error } = await associateSystems({
      fetchPolicy: 'no-cache',
      variables: {
        input: {
          id,
          systemIds: hosts.map((h) => h.id),
        },
      },
    });

    if (error) {
      throw error;
    }

    return data?.associateSystems?.profile;
  };
};

export default useAssociateSystems;
