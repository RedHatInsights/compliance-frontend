import React from 'react';
import ReportPDF from '../Components/ReportPDF';

// (Eventually) responsible for rendering sections and splitting into pages
const usePDFBuilder = (policy) => async (data) =>
  [<ReportPDF key="pdf-page-1" data={{ ...data, policy }} />];

export default usePDFBuilder;
