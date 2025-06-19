import React from 'react';
import ReportPDF from '../Components/ReportPDF';

// (Eventually) responsible for rendering sections and splitting into pages
const usePDFBuilder = (report) => async (data, ssgFinder) => [
  <ReportPDF
    key="pdf-page-1"
    data={{ ...data, report }}
    ssgFinder={ssgFinder}
  />,
];

export default usePDFBuilder;
