import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { shallow as enzymeShallow } from 'enzyme';

import Navbar from '../src/Navbar';

const shallow = element => enzymeShallow(element).first().shallow();

describe('<Navbar />', () => {
  it('should have default props', () => {
    const navbar = enzymeShallow(<Navbar />);

    expect(navbar).to.have.prop('dir', 'ltr');
    expect(navbar).to.have.prop('showPreviousButton', true);
    expect(navbar).to.have.prop('showNextButton', true);
  });
  it('should have the right class name', () => {
    const wrapper = shallow(<Navbar className="daypicker__navbar" />);
    expect(wrapper).to.have.className('daypicker__navbar');
  });
  it('should render the aria labels for buttons', () => {
    const wrapper = shallow(<Navbar className="daypicker__navbar" />);
    expect(wrapper.find('.daypicker__navbar__button--prev')).to.have.attr(
      'aria-label',
      'Previous Month'
    );
    expect(wrapper.find('.daypicker__navbar__button--next')).to.have.attr(
      'aria-label',
      'Next Month'
    );
  });
  it('should render custom aria labels', () => {
    const wrapper = shallow(
      <Navbar
        labels={{
          nextMonth: 'Successivo',
          previousMonth: 'Precedente',
        }}
        className="daypicker__navbar"
      />
    );
    expect(wrapper.find('.daypicker__navbar__button--prev')).to.have.attr(
      'aria-label',
      'Precedente'
    );
    expect(wrapper.find('.daypicker__navbar__button--next')).to.have.attr(
      'aria-label',
      'Successivo'
    );
  });
  it('should have the navigation buttons classes', () => {
    const wrapper = shallow(<Navbar className="daypicker__navbar" />);
    expect(wrapper.find('.daypicker__navbar__button').at(0)).to.have.className(
      'daypicker__navbar__button--prev'
    );
    expect(wrapper.find('.daypicker__navbar__button').at(1)).to.have.className(
      'daypicker__navbar__button--next'
    );
  });
  it('should invert buttons position for RTL', () => {
    const wrapper = shallow(<Navbar className="daypicker__navbar" dir="rtl" />);
    expect(wrapper.find('.daypicker__navbar__button').at(0)).to.have.className(
      'daypicker__navbar__button--next'
    );
    expect(wrapper.find('.daypicker__navbar__button').at(1)).to.have.className(
      'daypicker__navbar__button--prev'
    );
  });
  it('should not render the previous button', () => {
    const wrapper = shallow(
      <Navbar className="daypicker__navbar" showPreviousButton={false} />
    );
    expect(wrapper.find('.daypicker__navbar__button--prev')).to.have.length(0);
  });
  it('should not render the next button', () => {
    const wrapper = shallow(
      <Navbar className="daypicker__navbar" showNextButton={false} />
    );
    expect(wrapper.find('.daypicker__navbar__button--next')).to.have.length(0);
  });
  it('should call `onNextClick` when clicking the next button', () => {
    const handleNextClick = spy();
    const wrapper = shallow(
      <Navbar className="daypicker__navbar" onNextClick={handleNextClick} />
    );
    wrapper.find('.daypicker__navbar__button--next').simulate('click');
    expect(handleNextClick).to.have.been.calledOnce;
  });
  it('should call `onPreviousClick` when clicking the prev button', () => {
    const handlePreviousClick = spy();
    const wrapper = shallow(
      <Navbar
        className="daypicker__navbar"
        onPreviousClick={handlePreviousClick}
      />
    );
    wrapper.find('.daypicker__navbar__button--prev').simulate('click');
    expect(handlePreviousClick).to.have.been.calledOnce;
  });
  it('should call `onNextClick` when clicking the prev button for RTL', () => {
    const handleNextClick = spy();
    const wrapper = shallow(
      <Navbar
        className="daypicker__navbar"
        dir="rtl"
        onNextClick={handleNextClick}
      />
    );
    wrapper.find('.daypicker__navbar__button--prev').simulate('click');
    expect(handleNextClick).to.have.been.calledOnce;
  });
  it('should call `onPreviousClick` when clicking the next button for RTL', () => {
    const handlePreviousClick = spy();
    const wrapper = shallow(
      <Navbar
        className="daypicker__navbar"
        dir="rtl"
        onPreviousClick={handlePreviousClick}
      />
    );
    wrapper.find('.daypicker__navbar__button--next').simulate('click');
    expect(handlePreviousClick).to.have.been.calledOnce;
  });
});
