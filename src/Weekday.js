import React, { PropTypes } from 'react';
import defaultStyle from 'substyle';
import DayPickerPropTypes from './PropTypes';

function Weekday({
  weekday,
  style,
  weekdaysLong,
  weekdaysShort,
  localeUtils,
  locale,
}) {
  let title;
  if (weekdaysLong) {
    title = weekdaysLong[weekday];
  } else {
    title = localeUtils.formatWeekdayLong(weekday, locale);
  }
  let content;
  if (weekdaysShort) {
    content = weekdaysShort[weekday];
  } else {
    content = localeUtils.formatWeekdayShort(weekday, locale);
  }

  return (
    <div { ...style }>
      <abbr { ...style('abbr') } title={ title }>
        {content}
      </abbr>
    </div>
  );
}

export const WeekdayPropTypes = {
  weekday: PropTypes.number,
  style: PropTypes.func.isRequired,
  locale: PropTypes.string,
  localeUtils: DayPickerPropTypes.localeUtils,

  weekdaysLong: PropTypes.arrayOf(PropTypes.string),
  weekdaysShort: PropTypes.arrayOf(PropTypes.string),
};

Weekday.propTypes = WeekdayPropTypes;

const styled = defaultStyle({
  display: 'table-cell',
  padding: '.5rem',
  fontSize: '.875em',
  textAlign: 'center',
  color: '#8b9898',
});

export default styled(Weekday);
