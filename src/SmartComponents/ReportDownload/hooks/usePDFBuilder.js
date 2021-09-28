import React from 'react';
import ReportPDF from '../Components/ReportPDF';

// (Eventually) responsible for rendering sections and splitting into pages
const usePDFBuilder = (policy) => async (data, ssgFinder) =>
  [
    <ReportPDF
      key="pdf-page-1"
      data={{ ...data, policy }}
      ssgFinder={ssgFinder}
    />,
  ];

export default usePDFBuilder;
