import PolicySystemsTab from './PolicySystemsTab';
import { policies } from '@/__fixtures__/policies';
import useFeature from 'Utilities/hooks/useFeature';
jest.mock('Utilities/hooks/useFeature');

describe('PolicySystemsTab', () => {
  it('expect to render without error', () => {
    useFeature.mockImplementation(() => true);
    const policy = policies.edges[0].node;
    const wrapper = shallow(<PolicySystemsTab {...{ policy }} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('expect to render with no systems table', () => {
    const policy = {
      ...policies.edges[0].node,
      hosts: [],
    };

    const wrapper = shallow(<PolicySystemsTab {...{ policy }} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
