import { useMutation } from '@apollo/client';
import { CREATE_BUSINESS_OBJECTIVE } from '../graphql/mutations';

const useCreateBusinessObjective = () => {
  const [create] = useMutation(CREATE_BUSINESS_OBJECTIVE);

  return async (policy, newBusinessObjective) => {
    if (policy?.businessObjective?.title === newBusinessObjective?.title) {
      return policy?.businessObjective?.id;
    } else if (newBusinessObjective?.title === '') {
      return null;
    } else {
      const { data, error } = await create({
        variables: {
          input: { title: newBusinessObjective.title },
        },
      });

      if (error) {
        throw error;
      }

      return data.createBusinessObjective.businessObjective.id;
    }
  };
};

export default useCreateBusinessObjective;
