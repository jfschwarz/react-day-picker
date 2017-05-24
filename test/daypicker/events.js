import React from 'react';
import SyntheticEvent from 'react-dom/lib/SyntheticEvent';

import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon, { spy } from 'sinon';

import DayPicker from '../../src/DayPicker';
import keys from '../../src/keys';
import { formatMonthTitle } from '../../src/LocaleUtils';

describe('DayPicker’s events handlers', () => {
  it('should call the `onCaptionClick` handler', () => {
    const handleCaptionClick = spy();
    const wrapper = mount(
      <DayPicker className="daypicker" onCaptionClick={handleCaptionClick} />
    );
    expect(wrapper.find('.daypicker__month__caption')).to.have.length(1);
    wrapper.find('.daypicker__month__caption').simulate('click');
    expect(handleCaptionClick).to.have.been.calledWith(
      sinon.match(
        date =>
          date.getFullYear() === new Date().getFullYear() &&
          date.getMonth() === new Date().getMonth(),
        'currentMonth'
      ),
      sinon.match(e => e instanceof SyntheticEvent && e.target !== null, 'e')
    );
  });
  it("should call the day's cell event handlers", () => {
    const handleDayClick = spy();
    const handleDayMouseEnter = spy();
    const handleDayKeyDown = spy();
    const handleDayMouseLeave = spy();
    const handleDayTouchStart = spy();
    const handleDayTouchEnd = spy();

    const modifiers = { foo: d => d.getDate() === 15 };
    const wrapper = mount(
      <DayPicker
        className="daypicker"
        modifiers={modifiers}
        onDayClick={handleDayClick}
        onDayMouseEnter={handleDayMouseEnter}
        onDayMouseLeave={handleDayMouseLeave}
        onDayKeyDown={handleDayKeyDown}
        onDayTouchStart={handleDayTouchStart}
        onDayTouchEnd={handleDayTouchEnd}
      />
    );

    const eventArgs = [
      sinon.match(
        date =>
          date.getFullYear() === new Date().getFullYear() &&
          date.getMonth() === new Date().getMonth(),
        'currentMonth'
      ),
      sinon.match(mods => mods.foo, 'modifiers'),
      sinon.match(e => e instanceof SyntheticEvent && e.target !== null, 'e'),
    ];

    wrapper.find('.daypicker__day--foo').simulate('click');
    expect(handleDayClick).to.have.been.calledWith(...eventArgs);

    wrapper.find('.daypicker__day--foo').simulate('mouseEnter');
    expect(handleDayMouseEnter).to.have.been.calledWith(...eventArgs);

    wrapper.find('.daypicker__day--foo').simulate('mouseLeave');
    expect(handleDayMouseLeave).to.have.been.calledWith(...eventArgs);

    wrapper.find('.daypicker__day--foo').simulate('keyDown');
    expect(handleDayKeyDown).to.have.been.calledWith(...eventArgs);

    wrapper.find('.daypicker__day--foo').simulate('touchStart');
    expect(handleDayTouchStart).to.have.been.calledWith(...eventArgs);

    wrapper.find('.daypicker__day--foo').simulate('touchEnd');
    expect(handleDayTouchEnd).to.have.been.calledWith(...eventArgs);
  });
  it("should not call the day's cell event handlers for outside days", () => {
    const handleDayClick = spy();
    const handleDayMouseEnter = spy();
    const handleDayMouseLeave = spy();
    const wrapper = mount(
      <DayPicker
        className="daypicker"
        initialMonth={new Date(2015, 11, 5)}
        onDayClick={handleDayClick}
        onDayMouseEnter={handleDayMouseEnter}
        onDayMouseLeave={handleDayMouseLeave}
      />
    );

    wrapper.find('.daypicker__day--outside').at(0).simulate('click');
    expect(handleDayClick).to.not.have.been.called;

    wrapper.find('.daypicker__day--outside').at(0).simulate('mouseEnter');
    expect(handleDayMouseEnter).to.not.have.been.called;

    wrapper.find('.daypicker__day--outside').at(0).simulate('mouseLeave');
    expect(handleDayMouseLeave).to.not.have.been.called;
  });
  it('should call `onDayClick` event handler when pressing the ENTER key', () => {
    const handleDayClick = spy();
    const modifiers = { foo: d => d.getDate() === 15, bar: () => false };
    const wrapper = mount(
      <DayPicker
        className="daypicker"
        modifiers={modifiers}
        onDayClick={handleDayClick}
      />
    );
    const eventArgs = [
      sinon.match(
        date =>
          date.getFullYear() === new Date().getFullYear() &&
          date.getMonth() === new Date().getMonth(),
        'currentMonth'
      ),
      sinon.match(mods => mods.foo && !mods.bar, 'modifiers'),
      sinon.match(e => e instanceof SyntheticEvent && e.target !== null, 'e'),
    ];
    wrapper
      .find('.daypicker__day--foo')
      .simulate('keyDown', { keyCode: keys.ENTER });
    expect(handleDayClick).to.have.been.calledWith(...eventArgs);
  });
  it('should not call an undefined `onDayClick` event handler when pressing the ENTER key', () => {
    const handleDayClick = spy();
    const modifiers = { foo: d => d.getDate() === 15, bar: () => false };
    const wrapper = mount(
      <DayPicker className="daypicker" modifiers={modifiers} />
    );
    wrapper
      .find('.daypicker__day--foo')
      .simulate('keyDown', { keyCode: keys.ENTER });
    expect(handleDayClick).to.not.have.been.called;
  });
  it('should call `onDayClick` event handler when pressing the SPACE key', () => {
    const handleDayClick = spy();
    const modifiers = { foo: d => d.getDate() === 15 };
    const wrapper = mount(
      <DayPicker
        className="daypicker"
        modifiers={modifiers}
        onDayClick={handleDayClick}
      />
    );
    const eventArgs = [
      sinon.match(
        date =>
          date.getFullYear() === new Date().getFullYear() &&
          date.getMonth() === new Date().getMonth(),
        'currentMonth'
      ),
      sinon.match(mods => mods.foo, 'modifiers'),
      sinon.match(e => e instanceof SyntheticEvent && e.target !== null, 'e'),
    ];
    wrapper
      .find('.daypicker__day--foo')
      .simulate('keyDown', { keyCode: keys.SPACE });
    expect(handleDayClick).to.have.been.calledWith(...eventArgs);
  });
  it('should call `onKeyDown` event handler', () => {
    const handleKeyDown = spy();
    const wrapper = mount(<DayPicker onKeyDown={handleKeyDown} />);
    wrapper.simulate('keyDown');
    expect(handleKeyDown).to.have.been.calledWith(
      sinon.match(e => e instanceof SyntheticEvent && e.target !== null, 'e')
    );
  });
  it('should call `onKeyDown` also when changing month is disabled', () => {
    const handleKeyDown = spy();
    const wrapper = mount(
      <DayPicker onKeyDown={handleKeyDown} canChangeMonth={false} />
    );
    wrapper.simulate('keyDown');
    expect(handleKeyDown).to.have.been.calledWith(
      sinon.match(e => e instanceof SyntheticEvent && e.target !== null, 'e')
    );
  });
  it('should display the current month when clicking the today button', () => {
    const wrapper = mount(
      <DayPicker className="daypicker" initialMonth={new Date(2015, 1)} />
    );
    wrapper.find('button.DayPicker-TodayButton').simulate('click');
    expect(wrapper.find('.DayPicker-Footer')).to.exists;
    expect(wrapper.find('.DayPicker-Caption')).to.have.text(
      formatMonthTitle(new Date())
    );
  });
  it('should call `onWeekClick` when clicking on a week number', () => {
    const onWeekClick = spy();
    const wrapper = mount(
      <DayPicker
        showWeekNumbers
        onWeekClick={onWeekClick}
        initialMonth={new Date(2015, 1)}
      />
    );
    wrapper.find('.DayPicker-WeekNumber').at(1).simulate('click');
    expect(onWeekClick.getCall(0).args[0]).to.equal(6);
    expect(onWeekClick.getCall(0).args[1]).to.have.length(7);
  });
});
