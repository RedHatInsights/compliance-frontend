import React from 'react';

// (Eventually) responsible for rendering sections and splitting into pages
const usePDFBuilder = () => {
  const buildPages = (data) =>
    Promise.resolve([<div key="pdfreport" {...data} />]);
  return buildPages;
};

export default usePDFBuilder;
