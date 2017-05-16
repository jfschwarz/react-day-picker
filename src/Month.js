import React from 'react';
import PropTypes from 'prop-types';
import { defaultStyle } from 'substyle';
import DayPickerPropTypes from './PropTypes';
import Weekdays from './Weekdays';
import { getWeekArray } from './Helpers';

function Month({
  month,
  months,
  weekdaysLong,
  weekdaysShort,
  locale,
  localeUtils,
  captionElement,
  onCaptionClick,
  children,
  firstDayOfWeek,
  style,
  weekdayElement,
  fixedWeeks,
}) {
  const captionProps = {
    date: month,
    months,
    localeUtils,
    locale,
    onClick: onCaptionClick ? e => onCaptionClick(e, month) : undefined,
    ...style('caption'),
  };
  const weeks = getWeekArray(month, firstDayOfWeek, fixedWeeks);
  return (
    <div { ...style }>
      {React.cloneElement(captionElement, captionProps)}
      <Weekdays
        weekdaysShort={ weekdaysShort }
        weekdaysLong={ weekdaysLong }
        firstDayOfWeek={ firstDayOfWeek }
        locale={ locale }
        localeUtils={ localeUtils }
        weekdayElement={ weekdayElement }
        style={ style('weekdays') }
      />
      <div { ...style('body') } role="grid">
        {
          weeks.map((week, j) =>
            <div key={ j } { ...style('week') } role="gridcell">
              {week.map(day => children(day, month))}
            </div>,
        )}
      </div>
    </div>
  );
}

Month.propTypes = {
  month: PropTypes.instanceOf(Date).isRequired,
  months: React.PropTypes.arrayOf(React.PropTypes.string),
  captionElement: PropTypes.node.isRequired,
  firstDayOfWeek: PropTypes.number.isRequired,
  weekdaysLong: PropTypes.arrayOf(PropTypes.string),
  weekdaysShort: PropTypes.arrayOf(PropTypes.string),
  locale: PropTypes.string.isRequired,
  localeUtils: DayPickerPropTypes.localeUtils.isRequired,
  onCaptionClick: PropTypes.func,
  children: PropTypes.func.isRequired,
  style: PropTypes.func.isRequired,
  weekdayElement: PropTypes.element,
  fixedWeeks: PropTypes.bool,
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
