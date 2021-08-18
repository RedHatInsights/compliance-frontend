import { useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';
import {
  benchmarksQuery,
  profileRefIdsQuery,
} from '@/__fixtures__/benchmarks_rules.js';

jest.mock('@apollo/client');
jest.mock('react-redux', () => ({
  useDispatch: jest.fn({}),
  connect: (i) => i,
}));
jest.mock('redux-form', () => ({
  Field: 'Field',
  reduxForm: () => (component) => component,
  formValueSelector: () => () => '',
  propTypes: {
    change: jest.fn(),
  },
}));

import { CreateSCAPPolicy } from './CreateSCAPPolicy.js';

describe('CreateSCAPPolicy', () => {
  let component;
  const defaultProps = {
    change: () => ({}),
  };

  beforeEach(() => {
    useDispatch.mockImplementation(() => ({}));
  });

  it('expect to render without error', () => {
    useQuery.mockImplementation(() => ({
      data: {},
      error: false,
      loading: false,
    }));
    component = shallow(<CreateSCAPPolicy {...defaultProps} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render a spinner while loading', () => {
    useQuery.mockImplementation(() => ({
      data: {},
      error: false,
      loading: true,
    }));
    component = shallow(<CreateSCAPPolicy {...defaultProps} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render benchmarks and no policies until one is selected', () => {
    useQuery.mockImplementation(() => ({
      data: { latestBenchmarks: benchmarksQuery },
      error: false,
      loading: false,
    }));
    component = shallow(<CreateSCAPPolicy {...defaultProps} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render policies from the selected benchmark only', () => {
    useQuery.mockImplementation(() => ({
      data: { latestBenchmarks: benchmarksQuery, profiles: profileRefIdsQuery },
      error: false,
      loading: false,
    }));
    const wrapper = mount(<CreateSCAPPolicy {...defaultProps} />);
    expect(toJson(wrapper.find('Tile'), { mode: 'deep' })).toMatchSnapshot();
    expect(
      toJson(wrapper.find('ProfileTypeSelect'), { mode: 'shallow' })
    ).toMatchSnapshot();
  });
});
