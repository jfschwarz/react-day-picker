import React from 'react';
import { defaultStyle, PropTypes as SubstylePT } from 'substyle';
import PropTypes from './PropTypes';

function Weekdays({
  firstDayOfWeek,
  showWeekNumbers,
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
    const element = React.isValidElement(weekdayElement)
      ? React.cloneElement(weekdayElement, elementProps)
      : React.createElement(weekdayElement, elementProps);
    days.push(element);
  }

  return (
    <div {...style} role="rowgroup">
      <div {...style('row')} role="row">
        {showWeekNumbers && <div {...style('weekday')} />}
        {days}
      </div>
    </div>
  );
}

Weekdays.propTypes = {
  firstDayOfWeek: PropTypes.number.isRequired,
  weekdaysLong: PropTypes.arrayOf(PropTypes.string),
  weekdaysShort: PropTypes.arrayOf(PropTypes.string),
  showWeekNumbers: PropTypes.bool,
  locale: PropTypes.string.isRequired,

  localeUtils: PropTypes.localeUtils.isRequired,
  weekdayElement: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.instanceOf(React.Component),
  ]),

  ...SubstylePT,
};

const styled = defaultStyle({
  display: 'table-header-group',

  row: {
    display: 'table-row',
  },
});

export default styled(Weekdays);
