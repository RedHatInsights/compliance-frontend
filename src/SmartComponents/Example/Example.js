import React from 'react';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { ExamplesPage } from 'bastilian-tabletools';

const Example = () => {
  return (
    <>
      <PageHeader className="page-header">
        <PageHeaderTitle title="Example Table Page" />
      </PageHeader>
      <section className="pf-v5-c-page__main-section">
        <ExamplesPage />
      </section>
    </>
  );
};

export default Example;
