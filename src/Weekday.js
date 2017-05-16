import React from 'react';
import { defaultStyle, PropTypes as SubstylePT } from 'substyle';
import PropTypes from './PropTypes';

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
    <div {...style} role="columnheader">
      <abbr {...style('abbr')} title={title}>
        {content}
      </abbr>
    </div>
  );
}

export const WeekdayPropTypes = {
  weekday: PropTypes.number,
  style: PropTypes.func.isRequired,
  locale: PropTypes.string,
  localeUtils: PropTypes.localeUtils,

  weekdaysLong: PropTypes.arrayOf(PropTypes.string),
  weekdaysShort: PropTypes.arrayOf(PropTypes.string),

  ...SubstylePT,
};

Weekday.propTypes = WeekdayPropTypes;

const styled = defaultStyle({
  display: 'table-cell',
  textAlign: 'center',
});

export default styled(Weekday);
