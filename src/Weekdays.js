import React from 'react';
import PropTypes from 'prop-types';
import { defaultStyle } from 'substyle';
import DayPickerPropTypes from './PropTypes';

function Weekdays({
  firstDayOfWeek,
  weekdaysLong,
  weekdaysShort,
  locale,
  localeUtils,
  weekdayElement,
  style,
}) {
  const days = [];
  for (let i = 0; i < 7; i += 1) {
    const weekday = (i + firstDayOfWeek) % 7;
    const elementProps = {
      key: i,
      weekday,
      weekdaysLong,
      weekdaysShort,
      localeUtils,
      locale,
      ...style('weekday'),
    };
    const element = React.cloneElement(weekdayElement, elementProps);
    days.push(element);
  }

  return (
    <div { ...style } role="rowgroup">
      <div { ...style('row') } role="columnheader">
        {days}
      </div>
    </div>
  );
}

Weekdays.propTypes = {
  firstDayOfWeek: PropTypes.number.isRequired,
  weekdaysLong: PropTypes.arrayOf(PropTypes.string),
  weekdaysShort: PropTypes.arrayOf(PropTypes.string),
  locale: PropTypes.string.isRequired,
  localeUtils: DayPickerPropTypes.localeUtils.isRequired,
  weekdayElement: PropTypes.element,
  style: PropTypes.func.isRequired,
};

const styled = defaultStyle({
  display: 'table-header-group',

  row: {
    display: 'table-row',
  },
});

export default styled(Weekdays);
