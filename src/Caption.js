import React, { PropTypes } from 'react';
import defaultStyle from 'substyle';
import DayPickerPropTypes from './PropTypes';

function Caption({ date, months, locale, localeUtils, onClick, style }) {
  return (
    <div { ...style } onClick={ onClick } role="heading">
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
  style: PropTypes.func.isRequired,
};

const styled = defaultStyle({
  display: 'table-caption',
  height: '1.5rem',
  textAlign: 'center',
});

export default styled(Caption);
