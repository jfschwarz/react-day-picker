import React from 'react';
import { defaultStyle, PropTypes as SubstylePT } from 'substyle';
import PropTypes from './PropTypes';
import Weekdays from './Weekdays';
import { getWeekArray } from './Helpers';
import { getWeekNumber } from './DateUtils';

function Month({
  month,
  months,

  fixedWeeks,
  captionElement,
  weekdayElement,

  locale,
  localeUtils,
  weekdaysLong,
  weekdaysShort,
  firstDayOfWeek,

  onCaptionClick,
  children,
  footer,
  showWeekNumbers,
  onWeekClick,

  style,
}) {
  const captionProps = {
    date: month,
    months,
    localeUtils,
    locale,
    onClick: onCaptionClick ? e => onCaptionClick(month, e) : undefined,
    ...style('caption'),
  };
  const caption = React.isValidElement(captionElement)
    ? React.cloneElement(captionElement, captionProps)
    : React.createElement(captionElement, captionProps);

  const finalWeekdayElement = React.isValidElement(weekdayElement)
    ? React.cloneElement(weekdayElement, { ...style('weekday') })
    : React.createElement(weekdayElement, { ...style('weekday') });

  const weeks = getWeekArray(month, firstDayOfWeek, fixedWeeks);

  return (
    <div {...style} role="grid">
      {caption}
      <Weekdays
        weekdaysShort={weekdaysShort}
        weekdaysLong={weekdaysLong}
        firstDayOfWeek={firstDayOfWeek}
        showWeekNumbers={showWeekNumbers}
        locale={locale}
        localeUtils={localeUtils}
        weekdayElement={finalWeekdayElement}
        style={style('weekdays')}
      />
      <div {...style('body')} role="rowgroup">
        {weeks.map(week => {
          let weekNumber;
          if (showWeekNumbers) {
            weekNumber = getWeekNumber(week[0]);
          }
          return (
            <div key={week[0].getTime()} {...style('week')} role="row">
              {showWeekNumbers &&
                <div
                  {...style('weekNumber')}
                  tabIndex={0}
                  role="gridcell"
                  onClick={e => onWeekClick(weekNumber, week, e)}
                >
                  {weekNumber}
                </div>}
              {week.map(day => children(day, month))}
            </div>
          );
        })}
      </div>
      {footer &&
        <div {...style('footer')}>
          {footer}
        </div>}
    </div>
  );
}

Month.propTypes = {
  month: PropTypes.instanceOf(Date).isRequired,
  months: PropTypes.arrayOf(PropTypes.string),

  fixedWeeks: PropTypes.bool,
  captionElement: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.instanceOf(React.Component),
  ]).isRequired,
  weekdayElement: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.instanceOf(React.Component),
  ]),

  footer: PropTypes.node,
  showWeekNumbers: PropTypes.bool,
  onWeekClick: PropTypes.func,

  locale: PropTypes.string.isRequired,
  localeUtils: PropTypes.localeUtils.isRequired,
  weekdaysLong: PropTypes.arrayOf(PropTypes.string),
  weekdaysShort: PropTypes.arrayOf(PropTypes.string),
  firstDayOfWeek: PropTypes.number.isRequired,

  onCaptionClick: PropTypes.func,

  children: PropTypes.func.isRequired,

  ...SubstylePT,
};

const styled = defaultStyle({
  display: 'table',
  borderCollapse: 'collapse',
  borderSpacing: 0,
  userSelect: 'none',

  caption: {
    display: 'table-caption',
  },

  body: {
    display: 'table-row-group',
  },

  week: {
    display: 'table-row',
  },
});

export default styled(Month);
