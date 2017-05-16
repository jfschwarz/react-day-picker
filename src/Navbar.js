import React from 'react';
import { defaultStyle, PropTypes as SubstylePT } from 'substyle';
import PropTypes from './PropTypes';
import defaultClassNames from './classNames';

function Navbar({
  showPreviousButton,
  showNextButton,
  onPreviousClick,
  onNextClick,
  labels,
  dir,
  style,
}) {
  const previousClickHandler = dir === 'rtl' ? onNextClick : onPreviousClick;
  const nextClickHandler = dir === 'rtl' ? onPreviousClick : onNextClick;

  const previousButton =
    showPreviousButton &&
    <span
      role="button"
      aria-label={labels.previousMonth}
      key="previous"
      {...style('button')('&prev')}
      onClick={() => previousClickHandler()}
    >
      〈
    </span>;

  const nextButton =
    showNextButton &&
    <span
      role="button"
      aria-label={labels.nextMonth}
      key="right"
      {...style('button')('&next')}
      onClick={() => nextClickHandler()}
    >
      〉
    </span>;

  return (
    <div {...style}>
      {dir === 'rtl'
        ? [nextButton, previousButton]
        : [previousButton, nextButton]}
    </div>
  );
}

export const NavbarPropTypes = {
  showPreviousButton: PropTypes.bool,
  showNextButton: PropTypes.bool,
  onPreviousClick: PropTypes.func,
  onNextClick: PropTypes.func,
  dir: PropTypes.string,
  labels: PropTypes.shape({
    previousMonth: PropTypes.string.isRequired,
    nextMonth: PropTypes.string.isRequired,
  }),

  ...SubstylePT,
};

Navbar.propTypes = NavbarPropTypes;

Navbar.defaultProps = {
  dir: 'ltr',
  labels: {
    previousMonth: 'Previous Month',
    nextMonth: 'Next Month',
  },
  showPreviousButton: true,
  showNextButton: true,
};

const styled = defaultStyle({
  position: 'absolute',
  left: 0,
  right: 0,

  button: {
    position: 'absolute',
    width: '1.5rem',
    height: '1.5rem',
    cursor: 'pointer',

    '&prev': {
      left: 0,
    },

    '&next': {
      right: 0,
    },
  },
});

export default styled(Navbar);
