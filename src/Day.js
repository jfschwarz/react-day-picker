/* eslint-disable jsx-a11y/no-static-element-interactions, react/forbid-prop-types */

import React from 'react';
import { defaultStyle, PropTypes as SubstylePT } from 'substyle';
import PropTypes from './PropTypes';

function handleEvent(handler, day, modifiers) {
  if (!handler) {
    return undefined;
  }
  return e => {
    e.persist();
    handler(day, modifiers, e);
  };
}

function Day({
  day,
  tabIndex,
  empty,
  modifiers,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onKeyDown,
  onTouchStart,
  onTouchEnd,
  onFocus,
  ariaLabel,
  ariaDisabled,
  ariaSelected,
  children,
  dataDayInside,
  style,
}) {
  if (empty) {
    return <div role="gridcell" aria-disabled {...style} />;
  }

  return (
    <div
      {...style}
      dataDayInside={dataDayInside}
      tabIndex={tabIndex || 0}
      role="gridcell"
      aria-label={ariaLabel}
      aria-disabled={ariaDisabled.toString()}
      aria-selected={ariaSelected.toString()}
      onClick={handleEvent(onClick, day, modifiers)}
      onKeyDown={handleEvent(onKeyDown, day, modifiers)}
      onMouseEnter={handleEvent(onMouseEnter, day, modifiers)}
      onMouseLeave={handleEvent(onMouseLeave, day, modifiers)}
      onTouchEnd={handleEvent(onTouchEnd, day, modifiers)}
      onTouchStart={handleEvent(onTouchStart, day, modifiers)}
      onFocus={handleEvent(onFocus, day, modifiers)}
    >
      {children}
    </div>
  );
}

Day.propTypes = {
  day: PropTypes.instanceOf(Date).isRequired,
  children: PropTypes.node.isRequired,

  dataDayInside: PropTypes.bool,
  ariaDisabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
  ariaSelected: PropTypes.bool,
  empty: PropTypes.bool,
  modifiers: PropTypes.object,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onTouchEnd: PropTypes.func,
  onTouchStart: PropTypes.func,
  onFocus: PropTypes.func,
  tabIndex: PropTypes.number,

  ...SubstylePT,
};

Day.defaultProps = {
  modifiers: {},
  empty: false,
};

const styled = defaultStyle(
  {
    display: 'table-cell',
    cursor: 'pointer',
    verticalAlign: 'middle',

    '&today': {
      fontWeight: 500,
    },

    '&disabled': {
      cursor: 'default',
    },

    '&outside': {
      cursor: 'default',
    },
  },
  ({ modifiers }) => modifiers.map(modifier => `&${modifier}`)
);

export default styled(Day);
