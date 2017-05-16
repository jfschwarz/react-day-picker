import React from 'react';
import PropTypes from 'prop-types';
import DayPickerPropTypes from './PropTypes';

export default function Caption({ date, months, locale, localeUtils, onClick, className, style }) {
  return (
    <div { ...{ className, style, onClick } } role="heading">
      { months ?
        `${months[date.getMonth()]} ${date.getFullYear()}` :
        localeUtils.formatMonthTitle(date, locale)
      }
    </div>
  );
}

Caption.propTypes = {
  date: PropTypes.instanceOf(Date),
  months: React.PropTypes.arrayOf(React.PropTypes.string),
  locale: PropTypes.string,
  localeUtils: DayPickerPropTypes.localeUtils,
  onClick: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
};
