import React from 'react';
import { CalendarMonth, Title } from '@patternfly/react-core';

const CalendarFilter = ({ onChange, value }) => {
  const [date, setDate] = React.useState(new Date(2020, 10, 24));
  const onMonthChange = (_event, newDate) => {
    onChange('calendar-filter', newDate);
  };
  const inlineProps = {
    component: 'article',
    title: (
      <Title headingLevel="h4" id="favorite-date">
        Select your favorite date
      </Title>
    ),
    ariaLabelledby: 'favorite-date',
  };
  return (
    <>
      <CalendarMonth
        date={date}
        onChange={(_event, date) => setDate(date)}
        onMonthChange={onMonthChange}
        inlineProps={inlineProps}
      />
      <pre>Selected date: {date.toString()}</pre>
    </>
  );
};

export default CalendarFilter;
