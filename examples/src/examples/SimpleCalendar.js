import React from 'react';
import DayPicker from '../../../src';

import style from '../../../src/style';

export default function SimpleCalendar() {
  return <DayPicker style={ style } className="dp" onDayClick={ (e, day) => window.alert(day) } />;
}
