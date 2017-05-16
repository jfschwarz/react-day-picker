import React from 'react';
import DayPicker from '../../../src';

import '../../../src/style.css';

export default function BlockedNavigation() {
  return <DayPicker className="daypicker" canChangeMonth={false} />;
}
