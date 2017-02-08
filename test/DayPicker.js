/* eslint-disable jsx-a11y/tabindex-no-positive */

import React, { PropTypes } from 'react';
import SyntheticEvent from 'react-dom/lib/SyntheticEvent';
import { isElement } from 'react-addons-test-utils';
import { shallow as enzymeShallow, mount, render } from 'enzyme';
import { expect } from 'chai';
import sinon, { spy } from 'sinon';
import DayPicker from '../src/DayPicker';
import * as LocaleUtils from '../src/LocaleUtils';
import keys from '../src/keys';

const shallow = element => (
  enzymeShallow(element).first().shallow()
);

describe('<DayPicker />', () => {
  describe('rendering', () => {
    it('should use initialMonth as the current month', () => {
      const wrapper = mount(<DayPicker />);
      const instance = wrapper.instance().getWrappedInstance();
      expect(instance.props.initialMonth.getFullYear())
        .to.equal(instance.state.currentMonth.getFullYear());
      expect(instance.props.initialMonth.getMonth())
        .to.equal(instance.state.currentMonth.getMonth());
      expect(instance.state.currentMonth.getDate())
        .to.equal(1);
    });
    it('should render multiple months', () => {
      const wrapper = render(<DayPicker className="dp" numberOfMonths={ 12 } />);
      expect(wrapper.find('.dp__month')).to.have.length(12);
    });
    it('should render multiple months, reversed', () => {
      const wrapper = mount(
        <DayPicker className="dp" initialMonth={ new Date(2015, 0) } numberOfMonths={ 2 } reverseMonths />,
      );
      expect(wrapper.find('.dp__month__caption').at(0)).to.have.text('February 2015');
      expect(wrapper.find('.dp__month__caption').at(1)).to.have.text('January 2015');
    });
    it('should update the current month when `initialMonth` is updated', () => {
      const wrapper = mount(<DayPicker />);
      wrapper.setProps({ initialMonth: new Date(2016, 1, 15) });
      const instance = wrapper.instance().getWrappedInstance();
      expect(instance.state.currentMonth.getFullYear()).to.equal(2016);
      expect(instance.state.currentMonth.getMonth()).to.equal(1);
      expect(instance.state.currentMonth.getDate()).to.equal(1);
    });
    it('should not include the interactionDisabled CSS modifier', () => {
      const wrapper = shallow(<DayPicker className="dp" onDayClick={ () => {} } />);
      expect(wrapper).to.not.have.className('dp--interactionDisabled');
    });
    it('should include the given className', () => {
      const wrapper = shallow(<DayPicker className="given" />);
      expect(wrapper).to.have.className('given');
    });
    it('should have the application role', () => {
      const wrapper = shallow(<DayPicker />);
      expect(wrapper).to.have.attr('role', 'application');
    });
    it('should use the given tabIndex', () => {
      const wrapper = shallow(<DayPicker tabIndex={ 10 } />);
      expect(wrapper).to.have.attr('tabindex', '10');
    });
    it('should spread the rest of the props to the container', () => {
      const wrapper = shallow(<DayPicker data-foo="bar" />);
      expect(wrapper).to.have.attr('data-foo', 'bar');
    });
    it('should handle focus and blur events', () => {
      const handleBlur = spy();
      const handleFocus = spy();
      const wrapper = mount(<DayPicker onFocus={ handleFocus } onBlur={ handleBlur } />);
      wrapper.simulate('focus');
      wrapper.simulate('blur');
      expect(handleBlur).to.have.been.calledOnce;
      expect(handleFocus).to.have.been.calledOnce;
    });
    it('should include the navigation bar', () => {
      const wrapper = render(<DayPicker className="dp" />);
      expect(wrapper.find('.dp__navbar')).to.exist;
    });
    it('should render the day cells', () => {
      const wrapper = render(<DayPicker className="dp" initialMonth={ new Date(2015, 6) } />);
      expect(wrapper.find('.dp__day')).to.have.length(35);
    });
    it('should skip the navigation bar if can\'t change month', () => {
      const wrapper = render(<DayPicker className="dp" canChangeMonth={ false } />);
      expect(wrapper.find('.dp__navbar')).to.not.exist;
    });
    it('should render a custom number of months', () => {
      const wrapper = render(<DayPicker className="dp" numberOfMonths={ 3 } />);
      expect(wrapper.find('.dp__month')).to.have.length(3);
    });
    it('should render a custom caption element', () => {
      const Caption = () => <p>boo</p>;
      const wrapper = mount(<DayPicker captionElement={ <Caption /> } />);
      expect(wrapper.containsMatchingElement(<Caption />)).to.be.true;
    });
    it('should render a custom navbar element', () => {
      const CustomNavbar = ({ className }) => <div className={ className }>Navbar</div>;
      CustomNavbar.propTypes = { className: PropTypes.string };
      const navbar = <CustomNavbar className="customnavbar" />;
      const dayPicker = <DayPicker navbarElement={ navbar } />;
      const wrapper = mount(dayPicker);

      expect(isElement(dayPicker.props.navbarElement)).to.be.true;
      expect(wrapper.containsMatchingElement(navbar)).to.be.true;
      expect(wrapper.find('.customnavbar')).to.exist;
      expect(wrapper.find('.customnavbar').at(0)).to.have.text('Navbar');
    });
    it('should render a custom weekday element', () => {
      const CustomWeekday = ({ className, weekday }) =>
        <div className={ className }>{weekday}</div>;
      CustomWeekday.propTypes = { className: PropTypes.string, weekday: PropTypes.number };
      const weekday = <CustomWeekday />;
      const dayPicker = <DayPicker className="dp" weekdayElement={ weekday } />;
      const wrapper = mount(dayPicker);

      expect(isElement(dayPicker.props.weekdayElement)).to.be.true;
      expect(wrapper.containsMatchingElement(weekday)).to.be.true;
      expect(wrapper.find('.dp__month__weekdays__weekday')).to.have.length(7);
      const weekdayDoms = wrapper.find('.dp__month__weekdays__weekday');
      weekdayDoms.forEach((_, i) => {
        expect(weekdayDoms.at(i)).to.have.text(i);
      });
    });
    it('should not render the outside days', () => {
      const wrapper = mount(<DayPicker className="dp" initialMonth={ new Date(2015, 6) } />);
      expect(wrapper.find('.dp__day').at(0)).to.have.text('');
      expect(wrapper.find('.dp__day').at(1)).to.have.text('');
      expect(wrapper.find('.dp__day').at(2)).to.have.text('');
    });
    it('should render the outside days', () => {
      const wrapper = mount(<DayPicker className="dp" enableOutsideDays initialMonth={ new Date(2015, 6) } />);
      expect(wrapper.find('.dp__day').at(0)).to.have.text('28');
      expect(wrapper.find('.dp__day').at(1)).to.have.text('29');
      expect(wrapper.find('.dp__day').at(2)).to.have.text('30');
    });
    it('should render the fixed amount of weeks', () => {
      const wrapper = mount(
        <DayPicker className="dp" enableOutsideDays fixedWeeks initialMonth={ new Date(2015, 1) } />,
      );
      expect(wrapper.find('.dp__day')).to.have.length(42);
    });
  });

  describe('day modifiers', () => {
    it('should use `selectedDays` prop as `selected` modifier', () => {
      const wrapper = mount(
        <DayPicker
          className="dp"
          initialMonth={ new Date(2015, 6) }
          selectedDays={ () => true }
          modifiers={ { foo: () => true } }
        />,
      );
      expect(wrapper.find('.dp__day--selected')).to.have.length(35);
      expect(wrapper.find('.dp__day--foo')).to.have.length(35);
    });
    it('should add the `aria-selected` attribute for `selected` days', () => {
      const wrapper = mount(
        <DayPicker className="dp" initialMonth={ new Date(2015, 6) } selectedDays={ () => true } />,
      );
      expect(wrapper.find('.dp__day--selected').at(15)).to.have.attr('aria-selected', 'true');
    });
    it('should use `disabledDays` prop as `selected` modifier', () => {
      const wrapper = mount(
        <DayPicker
          className="dp"
          initialMonth={ new Date(2015, 6) }
          disabledDays={ () => true }
          modifiers={ { foo: () => true } }
        />,
      );
      expect(wrapper.find('.dp__day--disabled')).to.have.length(35);
      expect(wrapper.find('.dp__day--foo')).to.have.length(35);
    });
    it('should add the `aria-disabled` attribute for `disabled` days', () => {
      const wrapper = mount(
        <DayPicker className="dp" initialMonth={ new Date(2015, 6) } disabledDays={ () => true } />);
      expect(wrapper.find('.dp__day--disabled').first()).to.have.attr('aria-disabled', 'true');
    });
    it('should include "outside" for outside days', () => {
      const wrapper = mount(
        <DayPicker className="dp" initialMonth={ new Date(2015, 6) } enableOutsideDays />,
      );
      expect(wrapper.find('.dp__day').at(0)).to.have.className('dp__day--outside');
    });
    it('should include "today"', () => {
      const wrapper = mount(<DayPicker className="dp" />);
      expect(wrapper.find('.dp__day--today')).to.have.text((new Date()).getDate());
    });
    it('should add custom modifiers', () => {
      const modifiers = {
        firstDayOfMonth: day => day.getDate() === 1,
        all: () => true,
        none: () => false,
      };
      const wrapper = mount(
        <DayPicker
          className="dp"
          initialMonth={ new Date(2015, 6) }
          modifiers={ modifiers }
        />,
      );
      expect(wrapper.find('.dp__day--firstDayOfMonth')).to.have.length(2);
      expect(wrapper.find('.dp__day--none')).to.have.length(0);
      expect(wrapper.find('.dp__day--all')).to.have.length(35);
    });
  });

  describe('showNextMonth()', () => {
    it('should show the next month', () => {
      const instance = mount(
        <DayPicker
          initialMonth={ new Date(2015, 7) }
          enableOutsideDays={ false }
          numberOfMonths={ 2 }
        />,
      ).instance().getWrappedInstance();
      instance.showNextMonth();
      expect(instance.state.currentMonth.getFullYear()).to.equal(2015);
      expect(instance.state.currentMonth.getMonth()).to.equal(8);
      expect(instance.state.currentMonth.getDate()).to.equal(1);
    });
    it('should call the `onMonthChange` handler', () => {
      const handleMonthChange = spy();
      const instance = mount(
        <DayPicker onMonthChange={ handleMonthChange } />,
      ).instance().getWrappedInstance();
      instance.showNextMonth();
      expect(handleMonthChange).to.have.been.calledWith(instance.state.currentMonth);
    });
    it('should not show the next month if after `toMonth`', () => {
      const instance = mount(
        <DayPicker initialMonth={ new Date(2015, 7) } toMonth={ new Date(2015, 7) } />,
      ).instance().getWrappedInstance();
      instance.showNextMonth();
      expect(instance.state.currentMonth.getMonth()).to.equal(7);
    });
    it('should skip `numberOfMonths` months when `pagedNavigation`', () => {
      const instance = mount(
        <DayPicker
          initialMonth={ new Date(2015, 7) }
          enableOutsideDays={ false }
          numberOfMonths={ 2 }
          pagedNavigation
        />,
      ).instance().getWrappedInstance();
      instance.showNextMonth();
      expect(instance.state.currentMonth.getFullYear()).to.equal(2015);
      expect(instance.state.currentMonth.getMonth()).to.equal(9);
      expect(instance.state.currentMonth.getDate()).to.equal(1);
    });
  });

  describe('showPreviousMonth()', () => {
    it('should show the previous month', () => {
      const instance = mount(
        <DayPicker initialMonth={ new Date(2015, 7) } enableOutsideDays={ false } />,
      ).instance().getWrappedInstance();
      instance.showPreviousMonth();
      expect(instance.state.currentMonth.getMonth()).to.equal(6);
      expect(instance.state.currentMonth.getDate()).to.equal(1);
      expect(instance.state.currentMonth.getFullYear()).to.equal(2015);
    });
    it('should call the `onMonthChange` handler', () => {
      const handleMonthChange = spy();
      const instance = mount(
        <DayPicker onMonthChange={ handleMonthChange } />,
      ).instance().getWrappedInstance();
      instance.showPreviousMonth();
      expect(handleMonthChange).to.have.been.calledWith(instance.state.currentMonth);
    });
    it('should not show the previous month if before `fromMonth`', () => {
      const instance = mount(
        <DayPicker initialMonth={ new Date(2015, 7) } fromMonth={ new Date(2015, 7) } />,
      ).instance().getWrappedInstance();
      instance.showPreviousMonth();
      expect(instance.state.currentMonth.getMonth()).to.equal(7);
    });
    it('should skip `numberOfMonths` months when `pagedNavigation`', () => {
      const instance = mount(
        <DayPicker
          initialMonth={ new Date(2015, 7) }
          enableOutsideDays={ false }
          numberOfMonths={ 2 }
          pagedNavigation
        />,
      ).instance().getWrappedInstance();
      instance.showPreviousMonth();
      expect(instance.state.currentMonth.getFullYear()).to.equal(2015);
      expect(instance.state.currentMonth.getMonth()).to.equal(5);
      expect(instance.state.currentMonth.getDate()).to.equal(1);
    });
  });

  describe('showNextYear()', () => {
    it('should show the next year', () => {
      const instance = mount(
        <DayPicker initialMonth={ new Date(2015, 7, 1) } />,
      ).instance().getWrappedInstance();
      instance.showNextYear();
      expect(instance.state.currentMonth.getMonth()).to.equal(7);
      expect(instance.state.currentMonth.getDate()).to.equal(1);
      expect(instance.state.currentMonth.getFullYear()).to.equal(2016);
    });
    it('should call the `onMonthChange` handler', () => {
      const handleMonthChange = spy();
      const instance = mount(
        <DayPicker onMonthChange={ handleMonthChange } />,
      ).instance().getWrappedInstance();
      instance.showNextYear();
      expect(handleMonthChange).to.have.been.calledWith(instance.state.currentMonth);
    });
    it('should not show the next year if after `toMonth`', () => {
      const instance = mount(
        <DayPicker initialMonth={ new Date(2015, 7) } toMonth={ new Date(2015, 7) } />,
      ).instance().getWrappedInstance();
      instance.showNextYear();
      expect(instance.state.currentMonth.getFullYear()).to.equal(2015);
    });
    it('should not change the year if cannot change month', () => {
      const instance = mount(
        <DayPicker initialMonth={ new Date(2015, 7) } canChangeMonth={ false } />,
      ).instance().getWrappedInstance();
      instance.showNextYear();
      expect(instance.state.currentMonth.getFullYear()).to.equal(2015);
    });
  });

  describe('showPreviousYear()', () => {
    it('should show the previous year', () => {
      const instance = mount(
        <DayPicker initialMonth={ new Date(2015, 7, 1) } />,
      ).instance().getWrappedInstance();
      instance.showPreviousYear();
      expect(instance.state.currentMonth.getMonth()).to.equal(7);
      expect(instance.state.currentMonth.getDate()).to.equal(1);
      expect(instance.state.currentMonth.getFullYear()).to.equal(2014);
    });
    it('should call the `onMonthChange` handler', () => {
      const handleMonthChange = spy();
      const instance = mount(
        <DayPicker onMonthChange={ handleMonthChange } />,
      ).instance().getWrappedInstance();
      instance.showPreviousYear();
      expect(handleMonthChange).to.have.been.calledWith(instance.state.currentMonth);
    });
    it('should not show the previous year if before `fromMonth`', () => {
      const instance = mount(
        <DayPicker initialMonth={ new Date(2015, 7) } fromMonth={ new Date(2015, 7) } />,
      ).instance().getWrappedInstance();
      instance.showPreviousYear();
      expect(instance.state.currentMonth.getFullYear()).to.equal(2015);
    });
    it('should not change the year if cannot change month', () => {
      const instance = mount(
        <DayPicker initialMonth={ new Date(2015, 7) } canChangeMonth={ false } />,
      ).instance().getWrappedInstance();
      instance.showPreviousYear();
      expect(instance.state.currentMonth.getFullYear()).to.equal(2015);
    });
  });

  describe('showMonth()', () => {
    it('should show the specified month', () => {
      const instance = mount(
        <DayPicker initialMonth={ new Date(2015, 5, 4) } />,
      ).instance().getWrappedInstance();
      instance.showMonth(new Date(2016, 1, 15));
      expect(instance.state.currentMonth.getFullYear()).to.equal(2016);
      expect(instance.state.currentMonth.getMonth()).to.equal(1);
      expect(instance.state.currentMonth.getDate()).to.equal(1);
    });
    it('should not change month if after `toMonth`', () => {
      const instance = mount(
        <DayPicker initialMonth={ new Date(2015, 5) } toMonth={ new Date(2015, 5) } />,
      ).instance().getWrappedInstance();
      instance.showMonth(new Date(2016, 1, 15));
      expect(instance.state.currentMonth.getFullYear()).to.equal(2015);
      expect(instance.state.currentMonth.getMonth()).to.equal(5);
      expect(instance.state.currentMonth.getDate()).to.equal(1);
    });
    it('should not change month if before `fromMonth`', () => {
      const instance = mount(
        <DayPicker initialMonth={ new Date(2015, 5) } fromMonth={ new Date(2015, 5) } />,
      ).instance().getWrappedInstance();
      instance.showMonth(new Date(2015, 1));
      expect(instance.state.currentMonth.getFullYear()).to.equal(2015);
      expect(instance.state.currentMonth.getMonth()).to.equal(5);
      expect(instance.state.currentMonth.getDate()).to.equal(1);
    });
  });

  describe('focus methods', () => {
    let wrapper;
    let instance;
    let body;

    beforeEach(() => {
      wrapper = mount(<DayPicker className="dp" initialMonth={ new Date(2015, 5) } />);
      instance = wrapper.instance().getWrappedInstance();
      body = wrapper.find('.dp__month__body').nodes[0];
    });

    function getDayNode(monthBody, weekIndex, dayIndex) {
      return monthBody.childNodes[weekIndex].childNodes[dayIndex];
    }

    describe('focusPreviousDay()', () => {
      it('should focus on the previous day of the current month', () => {
        const focusedNode = getDayNode(body, 0, 2);
        const previousNode = getDayNode(body, 0, 1);
        instance.focusPreviousDay(focusedNode);

        expect(focusedNode.innerHTML).to.equal('2');
        expect(previousNode.innerHTML).to.equal('1');
        expect(document.activeElement.innerHTML).to.equal('1');
        expect(instance.state.currentMonth.getMonth()).to.equal(5);
      });
      it('should focus on the last day of the previous week', () => {
        const focusedNode = getDayNode(body, 1, 0);
        const previousNode = getDayNode(body, 0, 6);
        instance.focusPreviousDay(focusedNode);

        expect(focusedNode.innerHTML).to.equal('7');
        expect(previousNode.innerHTML).to.equal('6');
        expect(document.activeElement.innerHTML).to.equal('6');
        expect(instance.state.currentMonth.getMonth()).to.equal(5);
      });
      it('should focus on the last day of the previous month', () => {
        const focusedNode = getDayNode(body, 0, 1);
        instance.focusPreviousDay(focusedNode);

        expect(focusedNode.innerHTML).to.equal('1');
        expect(document.activeElement.innerHTML).to.equal('31');
        expect(instance.state.currentMonth.getMonth()).to.equal(4);
      });
    });

    describe('focusNextDay()', () => {
      it('should focus on the next day of the current month', () => {
        const focusedNode = getDayNode(body, 0, 2);
        const nextNode = getDayNode(body, 0, 3);
        instance.focusNextDay(focusedNode);

        expect(focusedNode.innerHTML).to.equal('2');
        expect(nextNode.innerHTML).to.equal('3');
        expect(document.activeElement.innerHTML).to.equal('3');
        expect(instance.state.currentMonth.getMonth()).to.equal(5);
      });
      it('should focus on the first day of the next week', () => {
        const focusedNode = getDayNode(body, 0, 6);
        const nextNode = getDayNode(body, 1, 0);
        instance.focusNextDay(focusedNode);

        expect(focusedNode.innerHTML).to.equal('6');
        expect(nextNode.innerHTML).to.equal('7');
        expect(document.activeElement.innerHTML).to.equal('7');
        expect(instance.state.currentMonth.getMonth()).to.equal(5);
      });
      it('should focus on the first day of the next month', () => {
        const focusedNode = getDayNode(body, 4, 2);
        instance.focusNextDay(focusedNode);

        expect(focusedNode.innerHTML).to.equal('30');
        expect(document.activeElement.innerHTML).to.equal('1');
        expect(instance.state.currentMonth.getMonth()).to.equal(6);
      });
      it('should focus the first day of the next month after leapday', () => {
        wrapper = mount(<DayPicker className="dp" initialMonth={ new Date(2016, 1) } />);
        instance = wrapper.instance().getWrappedInstance();
        body = wrapper.find('.dp__month__body').nodes[0];

        const focusedNode = getDayNode(body, 4, 1);
        instance.focusNextDay(focusedNode);

        expect(focusedNode.innerHTML).to.equal('29');
        expect(document.activeElement.innerHTML).to.equal('1');
        expect(instance.state.currentMonth.getMonth()).to.equal(2);
      });
    });

    describe('focusNextWeek()', () => {
      it('should focus on the same day of the next week', () => {
        const focusedNode = getDayNode(body, 2, 1);
        instance.focusNextWeek(focusedNode);

        expect(focusedNode.innerHTML).to.equal('15');
        expect(document.activeElement.innerHTML).to.equal('22');
        expect(instance.state.currentMonth.getMonth()).to.equal(5);
      });
      it('should focus on the same day of the next week in the next month', () => {
        const juneThirtieth = getDayNode(body, 4, 2);
        expect(juneThirtieth.innerHTML).to.equal('30');

        instance.focusNextWeek(juneThirtieth);
        expect(document.activeElement.innerHTML).to.equal('7');
        expect(instance.state.currentMonth.getMonth()).to.equal(6);

        const julyThirtyFirst = getDayNode(body, 4, 5);
        expect(julyThirtyFirst.innerHTML).to.equal('31');

        instance.focusNextWeek(julyThirtyFirst);
        expect(document.activeElement.innerHTML).to.equal('7');
        expect(instance.state.currentMonth.getMonth()).to.equal(7);
      });
    });

    describe('focusPreviousWeek()', () => {
      it('should focus on the same day of the previous week', () => {
        const focusedNode = getDayNode(body, 2, 1);
        expect(focusedNode.innerHTML).to.equal('15');

        instance.focusPreviousWeek(focusedNode);
        expect(document.activeElement.innerHTML).to.equal('8');
        expect(instance.state.currentMonth.getMonth()).to.equal(5);
      });
      it('should focus on the same day of the previous week in the previous month', () => {
        const juneFirst = getDayNode(body, 0, 1);
        expect(juneFirst.innerHTML).to.equal('1');

        instance.focusPreviousWeek(juneFirst);
        expect(document.activeElement.innerHTML).to.equal('25');
        expect(instance.state.currentMonth.getMonth()).to.equal(4);

        const maySecond = getDayNode(body, 1, 0);
        expect(maySecond.innerHTML).to.equal('3');

        instance.focusPreviousWeek(maySecond);
        expect(document.activeElement.innerHTML).to.equal('26');
        expect(instance.state.currentMonth.getMonth()).to.equal(3);
      });
    });
  });

  describe('events handlers', () => {
    it('should call the `onCaptionClick` handler', () => {
      const handleCaptionClick = spy();
      const wrapper = mount(<DayPicker className="dp" onCaptionClick={ handleCaptionClick } />);
      wrapper.find('.dp__month__caption').simulate('click');
      expect(handleCaptionClick).to.have.been.calledWith(
        sinon.match(e => e instanceof SyntheticEvent && e.target !== null, 'e'),
        sinon.match(date => date.getFullYear() === (new Date()).getFullYear() && date.getMonth() === (new Date()).getMonth(), 'currentMonth'),
      );
    });
    it('should call the day\'s cell event handlers', () => {
      const handleDayClick = spy();
      const handleDayMouseEnter = spy();
      const handleDayKeyDown = spy();
      const handleDayMouseLeave = spy();
      const handleDayTouchStart = spy();
      const handleDayTouchEnd = spy();

      const modifiers = { foo: d => d.getDate() === 15 };
      const wrapper = mount(
        <DayPicker
          className="dp"
          modifiers={ modifiers }
          onDayClick={ handleDayClick }
          onDayMouseEnter={ handleDayMouseEnter }
          onDayMouseLeave={ handleDayMouseLeave }
          onDayKeyDown={ handleDayKeyDown }
          onDayTouchStart={ handleDayTouchStart }
          onDayTouchEnd={ handleDayTouchEnd }
        />,
      );

      const eventArgs = [
        sinon.match(e => e instanceof SyntheticEvent && e.target !== null, 'e'),
        sinon.match(date => date.getFullYear() === (new Date()).getFullYear() && date.getMonth() === (new Date()).getMonth(), 'currentMonth'),
        sinon.match(mods => mods.foo, 'modifiers'),
      ];

      wrapper.find('.dp__day--foo').simulate('click');
      expect(handleDayClick).to.have.been.calledWith(...eventArgs);

      wrapper.find('.dp__day--foo').simulate('mouseEnter');
      expect(handleDayMouseEnter).to.have.been.calledWith(...eventArgs);

      wrapper.find('.dp__day--foo').simulate('mouseLeave');
      expect(handleDayMouseLeave).to.have.been.calledWith(...eventArgs);

      wrapper.find('.dp__day--foo').simulate('keyDown');
      expect(handleDayKeyDown).to.have.been.calledWith(...eventArgs);

      wrapper.find('.dp__day--foo').simulate('touchStart');
      expect(handleDayTouchStart).to.have.been.calledWith(...eventArgs);

      wrapper.find('.dp__day--foo').simulate('touchEnd');
      expect(handleDayTouchEnd).to.have.been.calledWith(...eventArgs);
    });
    it('should not call the day\'s cell event handlers for outside days', () => {
      const handleDayClick = spy();
      const handleDayMouseEnter = spy();
      const handleDayMouseLeave = spy();
      const wrapper = mount(
        <DayPicker
          className="dp"
          initialMonth={ new Date(2015, 11, 5) }
          onDayClick={ handleDayClick }
          onDayMouseEnter={ handleDayMouseEnter }
          onDayMouseLeave={ handleDayMouseLeave }
        />,
      );

      wrapper.find('.dp__day--outside').at(0).simulate('click');
      expect(handleDayClick).to.not.have.been.called;

      wrapper.find('.dp__day--outside').at(0).simulate('mouseEnter');
      expect(handleDayMouseEnter).to.not.have.been.called;

      wrapper.find('.dp__day--outside').at(0).simulate('mouseLeave');
      expect(handleDayMouseLeave).to.not.have.been.called;
    });
    it('should call `onDayClick` event handler when pressing the ENTER key', () => {
      const handleDayClick = spy();
      const modifiers = { foo: d => d.getDate() === 15, bar: () => false };
      const wrapper = mount(
        <DayPicker
          className="dp"
          modifiers={ modifiers }
          onDayClick={ handleDayClick }
        />,
      );
      const eventArgs = [
        sinon.match(e => e instanceof SyntheticEvent && e.target !== null, 'e'),
        sinon.match(date => date.getFullYear() === (new Date()).getFullYear() && date.getMonth() === (new Date()).getMonth(), 'currentMonth'),
        sinon.match(mods => mods.foo && !mods.bar, 'modifiers'),
      ];
      wrapper.find('.dp__day--foo').simulate('keyDown', { keyCode: keys.ENTER });
      expect(handleDayClick).to.have.been.calledWith(...eventArgs);
    });
    it('should call `onDayClick` event handler when pressing the SPACE key', () => {
      const handleDayClick = spy();
      const modifiers = { foo: d => d.getDate() === 15 };
      const wrapper = mount(
        <DayPicker
          className="dp"
          modifiers={ modifiers }
          onDayClick={ handleDayClick }
        />,
      );
      const eventArgs = [
        sinon.match(e => e instanceof SyntheticEvent && e.target !== null, 'e'),
        sinon.match(date => date.getFullYear() === (new Date()).getFullYear() && date.getMonth() === (new Date()).getMonth(), 'currentMonth'),
        sinon.match(mods => mods.foo, 'modifiers'),
      ];
      wrapper.find('.dp__day--foo').simulate('keyDown', { keyCode: keys.SPACE });
      expect(handleDayClick).to.have.been.calledWith(...eventArgs);
    });
    it('should call `onKeyDown` event handler', () => {
      const handleKeyDown = spy();
      const wrapper = mount(<DayPicker onKeyDown={ handleKeyDown } />);
      wrapper.simulate('keyDown');
      expect(handleKeyDown).to.have.been.calledWith(
        sinon.match(e => e instanceof SyntheticEvent && e.target !== null, 'e'),
      );
    });
    it('should call `onKeyDown` also when changing month is disabled', () => {
      const handleKeyDown = spy();
      const wrapper = mount(<DayPicker onKeyDown={ handleKeyDown } canChangeMonth={ false } />);
      wrapper.simulate('keyDown');
      expect(handleKeyDown).to.have.been.calledWith(
        sinon.match(e => e instanceof SyntheticEvent && e.target !== null, 'e'),
      );
    });
  });

  describe('navigation', () => {
    it('should not allow the previous month when the first month is the first allowed one', () => {
      const wrapper = shallow(
        <DayPicker
          initialMonth={ new Date(2015, 9) }
          fromMonth={ new Date(2015, 9) }
          numberOfMonths={ 3 }
        />,
      );
      expect(wrapper.instance().allowPreviousMonth()).to.be.false;
    });
    it('should not allow the previous month when cannot change months', () => {
      const wrapper = shallow(
        <DayPicker canChangeMonth={ false } />,
      );
      expect(wrapper.instance().allowPreviousMonth()).to.be.false;
    });
    it('should not allow the next month when the last month is the last allowed one', () => {
      const wrapper = shallow(
        <DayPicker
          initialMonth={ new Date(2015, 7) }
          toMonth={ new Date(2015, 9) }
          numberOfMonths={ 3 }
        />,
      );
      expect(wrapper.instance().allowNextMonth()).to.be.false;
    });
    it('should not allow the next month when cannot change months', () => {
      const wrapper = shallow(
        <DayPicker canChangeMonth={ false } />,
      );
      expect(wrapper.instance().allowNextMonth()).to.be.false;
    });
    it('should show the next month when clicking the next button', () => {
      const wrapper = mount(<DayPicker className="dp" initialMonth={ new Date(2015, 7) } />);
      wrapper.find('.dp__navbar__button--next').simulate('click');
      const instance = wrapper.instance().getWrappedInstance();
      expect(instance.state.currentMonth.getFullYear()).to.equal(2015);
      expect(instance.state.currentMonth.getMonth()).to.equal(8);
      expect(instance.state.currentMonth.getDate()).to.equal(1);
    });
    it('should show the next month when clicking outside days', () => {
      const wrapper = mount(
        <DayPicker className="dp" initialMonth={ new Date(2015, 7) } enableOutsideDays onDayClick={ () => {} } />,
      );
      wrapper.find('.dp__day--outside').last().simulate('click');
      const instance = wrapper.instance().getWrappedInstance();
      expect(instance.state.currentMonth.getFullYear()).to.equal(2015);
      expect(instance.state.currentMonth.getMonth()).to.equal(8);
    });
    it('should show the previous month when clicking the previous button', () => {
      const wrapper = mount(<DayPicker className="dp" initialMonth={ new Date(2015, 7) } />);
      wrapper.find('.dp__navbar__button--prev').simulate('click');
      const instance = wrapper.instance().getWrappedInstance();
      expect(instance.state.currentMonth.getFullYear()).to.equal(2015);
      expect(instance.state.currentMonth.getMonth()).to.equal(6);
    });
    it('should show the previous month when clicking outside days', () => {
      const wrapper = mount(
        <DayPicker className="dp" initialMonth={ new Date(2015, 7) } enableOutsideDays onDayClick={ () => {} } />,
      );
      wrapper.find('.dp__day--outside').first().simulate('click');
      const instance = wrapper.instance().getWrappedInstance();
      expect(instance.state.currentMonth.getFullYear()).to.equal(2015);
      expect(instance.state.currentMonth.getMonth()).to.equal(6);
    });
    it('should not allow changing to the year when cannot change months', () => {
      const wrapper = shallow(
        <DayPicker canChangeMonth={ false } />,
      );
      expect(wrapper.instance().allowYearChange()).to.be.false;
    });
    it('should call `showNextMonth()` when the RIGHT key is pressed', () => {
      const wrapper = mount(<DayPicker />);
      const showNextMonth = spy(wrapper.instance().getWrappedInstance(), 'showNextMonth');
      wrapper.simulate('keyDown', { keyCode: keys.RIGHT });
      expect(showNextMonth).to.have.been.calledOnce;
      showNextMonth.restore();
    });
    it('should call `showPreviousMonth()` when the LEFT key is pressed', () => {
      const wrapper = mount(<DayPicker />);
      const showPreviousMonth = spy(wrapper.instance().getWrappedInstance(), 'showPreviousMonth');
      wrapper.simulate('keyDown', { keyCode: keys.LEFT });
      expect(showPreviousMonth).to.have.been.calledOnce;
      showPreviousMonth.restore();
    });
    it('should call `showPreviousYear()` when the UP key is pressed', () => {
      const wrapper = mount(<DayPicker />);
      const showPreviousYear = spy(wrapper.instance().getWrappedInstance(), 'showPreviousYear');
      wrapper.simulate('keyDown', { keyCode: keys.UP });
      expect(showPreviousYear).to.have.been.calledOnce;
      showPreviousYear.restore();
    });
    it('should call `showNextYear()` when the DOWN key is pressed', () => {
      const wrapper = mount(<DayPicker />);
      const showNextYear = spy(wrapper.instance().getWrappedInstance(), 'showNextYear');
      wrapper.simulate('keyDown', { keyCode: keys.DOWN });
      expect(showNextYear).to.have.been.calledOnce;
      showNextYear.restore();
    });
    it('should call `focusNextDay()` when the RIGHT key is pressed on a day', () => {
      const wrapper = mount(<DayPicker className="dp" />);
      const focusNextDay = spy(wrapper.instance().getWrappedInstance(), 'focusNextDay');
      wrapper
        .find('.dp__day')
        .filterWhere(node => !node.hasClass('dp__day--outside'))
        .first()
        .simulate('keyDown', { keyCode: keys.RIGHT });
      expect(focusNextDay).to.have.been.calledOnce;
      focusNextDay.restore();
    });
    it('should call `focusPreviousDay()` when the LEFT key is pressed on a day', () => {
      const wrapper = mount(<DayPicker className="dp" />);
      const focusPreviousDay = spy(wrapper.instance().getWrappedInstance(), 'focusPreviousDay');
      wrapper
        .find('.dp__day')
        .filterWhere(node => !node.hasClass('dp__day--outside'))
        .first()
        .simulate('keyDown', { keyCode: keys.LEFT });
      expect(focusPreviousDay).to.have.been.calledOnce;
      focusPreviousDay.restore();
    });
    it('should call `focusNextWeek()` when the DOWN key is pressed on a day', () => {
      const wrapper = mount(<DayPicker className="dp" />);
      const focusNextWeek = spy(wrapper.instance().getWrappedInstance(), 'focusNextWeek');
      wrapper
        .find('.dp__day')
        .filterWhere(node => !node.hasClass('dp__day--outside'))
        .first()
        .simulate('keyDown', { keyCode: keys.DOWN });
      expect(focusNextWeek).to.have.been.calledOnce;
      focusNextWeek.restore();
    });
    it('should call `focusPreviousWeek()` when the UP key is pressed on a day', () => {
      const wrapper = mount(<DayPicker className="dp" />);
      const focusPreviousWeek = spy(wrapper.instance().getWrappedInstance(), 'focusPreviousWeek');
      wrapper
        .find('.dp__day')
        .filterWhere(node => !node.hasClass('dp__day--outside'))
        .last()
        .simulate('keyDown', { keyCode: keys.UP });
      expect(focusPreviousWeek).to.have.been.calledOnce;
      focusPreviousWeek.restore();
    });
  });

  describe('paged navigation', () => {
    it('should set the current month to the first month in its page if fromMonth is set', () => {
      const instance = shallow(
        <DayPicker
          initialMonth={ new Date(2015, 7) }
          fromMonth={ new Date(2015, 1) }
          numberOfMonths={ 4 }
          pagedNavigation
        />,
      ).instance();
      expect(instance.state.currentMonth.getFullYear()).to.equal(2015);
      expect(instance.state.currentMonth.getMonth()).to.equal(5);
      expect(instance.state.currentMonth.getDate()).to.equal(1);
    });
  });

  describe('when localized', () => {
    it('should use the months prop to localize the month names', () => {
      const wrapper = mount(
        <DayPicker
          className="dp"
          initialMonth={ new Date(2015, 0) }
          months={ ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'] }
        />);
      expect(wrapper.find('.dp__month__caption')).to.have.text('Gennaio 2015');
    });
    it('should use the firstDayOfWeek prop to set the first day of the week', () => {
      const wrapper = mount(
        <DayPicker
          className="dp"
          initialMonth={ new Date(2015, 0) }
          firstDayOfWeek={ 1 }
        />);
      expect(wrapper.find('.dp__month__weekdays__weekday').first()).to.have.text('Mo');
      expect(wrapper.find('.dp__day').at(3)).to.have.text('1');
    });
    it('should use the weekdaysShort prop to localize the weekday names', () => {
      const wrapper = mount(
        <DayPicker
          className="dp"
          initialMonth={ new Date(2015, 0) }
          weekdaysShort={ ['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'] }
        />);
      expect(wrapper.find('.dp__month__weekdays__weekday').first()).to.have.text('Do');
    });
    it('should use the weekdaysLong prop to localize the weekday names', () => {
      const wrapper = mount(
        <DayPicker
          className="dp"
          initialMonth={ new Date(2015, 0) }
          weekdaysLong={ ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'] }
        />);
      expect(wrapper.find('.dp__month__weekdays__weekday > abbr').first()).to.have.attr('title', 'Domenica');
    });
    it('should render weekday labels accounting for locale settings', () => {
      const localeUtils = Object.assign({}, LocaleUtils, { getFirstDayOfWeek: () => 1 });
      const wrapper = mount(<DayPicker className="dp" localeUtils={ localeUtils } />);
      expect(wrapper.find('.dp__month__weekdays__weekday').first()).to.have.text('Mo');
    });
  });
});
