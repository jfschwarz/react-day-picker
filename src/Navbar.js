import React, { PropTypes } from 'react';
import defaultStyle from 'substyle';

function Navbar({
  style,
  showPreviousButton,
  showNextButton,
  onPreviousClick,
  onNextClick,
  dir,
}) {
  const previousClickHandler = dir === 'rtl' ? onNextClick : onPreviousClick;
  const nextClickHandler = dir === 'rtl' ? onPreviousClick : onNextClick;

  const previousButton = showPreviousButton &&
    <span
      role="button"
      key="previous"
      { ...style('button')('&prev') }
      onClick={ () => previousClickHandler() }
    >&#x3008;</span>;

  const nextButton = showNextButton &&
    <span
      role="button"
      key="right"
      { ...style('button')('&next') }
      onClick={ () => nextClickHandler() }
    >&#x3009;</span>;

  return (
    <div { ...style }>
      {dir === 'rtl' ? [nextButton, previousButton] : [previousButton, nextButton]}
    </div>
  );
}

export const NavbarPropTypes = {
  style: PropTypes.func.isRequired,
  showPreviousButton: PropTypes.bool,
  showNextButton: PropTypes.bool,
  onPreviousClick: PropTypes.func,
  onNextClick: PropTypes.func,
  dir: PropTypes.string,
};

Navbar.propTypes = NavbarPropTypes;

Navbar.defaultProps = {
  dir: 'ltr',
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
