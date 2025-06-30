import React from 'react';
import ReportPDF from '../Components/ReportPDF';

// (Eventually) responsible for rendering sections and splitting into pages
const usePDFBuilder = (report) => async (data) => [
  <ReportPDF key="pdf-page-1" data={{ ...data, report }} />,
];

export default usePDFBuilder;
