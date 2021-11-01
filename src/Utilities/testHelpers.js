import useFeature from 'Utilities/hooks/useFeature';
jest.doMock('Utilities/hooks/useFeature', () => jest.fn());

export const useWithFeature = (feature, tests) => {
  describe(`with ${feature} turned ON`, () => {
    beforeEach(() => {
      useFeature.mockImplementation((useFeatureFeature) => {
        console.log('YOU', useFeatureFeature);
        return useFeatureFeature === feature ? true : false;
      });
    });

    tests();
  });

  describe(`with ${feature} turned OFF`, () => {
    beforeEach(() => {
      useFeature.mockImplementation((useFeatureFeature) =>
        useFeatureFeature === feature ? false : false
      );
    });

    tests();
  });
};
