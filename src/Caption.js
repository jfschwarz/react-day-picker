import React from 'react';
import PropTypes from './PropTypes';

export default function Caption({
  className,
  style,
  date,
  months,
  locale,
  localeUtils,
  onClick,
}) {
  return (
    <div {...{ className, style, onClick }} role="heading">
      {months
        ? `${months[date.getMonth()]} ${date.getFullYear()}`
        : localeUtils.formatMonthTitle(date, locale)}
    </div>
  );
}

Caption.propTypes = {
  date: PropTypes.instanceOf(Date),
  months: PropTypes.arrayOf(PropTypes.string),
  locale: PropTypes.string,
  localeUtils: PropTypes.localeUtils,
  onClick: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
};
