import React from 'react';
import PropTypes from 'prop-types';

import { isElement } from 'react-addons-test-utils';
import { expect } from 'chai';
import { shallow as enzymeShallow, mount, render } from 'enzyme';
import { spy } from 'sinon';

import DayPicker from '../../src/DayPicker';

const shallow = element => enzymeShallow(element).first().shallow();

describe('DayPicker’s rendering', () => {
  it('should have default props', () => {
    const dayPicker = enzymeShallow(<DayPicker className="daypicker" />);
    const now = new Date();

    expect(dayPicker.props().initialMonth.getMonth()).to.equal(now.getMonth());
    expect(dayPicker.props().initialMonth.getYear()).to.equal(now.getYear());
    expect(dayPicker.props().numberOfMonths).to.equal(1);
    expect(dayPicker.props().locale).to.equal('en');
    expect(dayPicker.props().enableOutsideDays).to.equal(false);
    expect(dayPicker.props().fixedWeeks).to.equal(false);
    expect(dayPicker.props().canChangeMonth).to.equal(true);
    expect(dayPicker.props().reverseMonths).to.equal(false);
    expect(dayPicker.props().pagedNavigation).to.equal(false);
    expect(dayPicker.props().renderDay).to.be.a('Function');
    expect(dayPicker.props().weekdayElement).to.be.a('object');
    expect(dayPicker.props().navbarElement).to.be.a('object');
    expect(dayPicker.props().tabIndex).to.equal(0);
  });
  it('should have the right CSS classes and attributes', () => {
    const wrapper = shallow(<DayPicker className="daypicker" />);
    expect(wrapper.find('.daypicker')).to.have.length(1);
    expect(wrapper).to.have.attr('lang', 'en');
    expect(wrapper).to.have.className('daypicker--interactionDisabled');
  });
  it('should use `initialMonth` as the current month', () => {
    const wrapper = shallow(<DayPicker className="daypicker" />);
    const instance = wrapper.instance();
    expect(instance.props.initialMonth.getFullYear()).to.equal(
      instance.state.currentMonth.getFullYear()
    );
    expect(instance.props.initialMonth.getMonth()).to.equal(
      instance.state.currentMonth.getMonth()
    );
    expect(instance.state.currentMonth.getDate()).to.equal(1);
  });
  it('should use `month` as the current month instead of `initialMonth`', () => {
    const wrapper = shallow(
      <DayPicker
        className="daypicker"
        month={new Date(2018, 10, 11)}
        initialMonth={new Date(2018, 1, 11)}
      />
    );
    const instance = wrapper.instance();
    expect(instance.props.month.getFullYear()).to.equal(
      instance.state.currentMonth.getFullYear()
    );
    expect(instance.props.month.getMonth()).to.equal(
      instance.state.currentMonth.getMonth()
    );
    expect(instance.state.currentMonth.getDate()).to.equal(1);
  });
  it('should update the current month when `month` is updated', () => {
    const wrapper = mount(
      <DayPicker className="daypicker" month={new Date(2018, 10, 11)} />
    );

    wrapper.find('Month').forEach((month, index) => {
      expect(month).to.have.prop('month', new Date(2018, 10 + index, 11));
    });

    wrapper.setProps({ month: new Date(2016, 1, 15) });

    wrapper.find('Month').forEach((month, index) => {
      expect(month).to.have.prop('month', new Date(2016, 1 + index, 15));
    });

    expect(wrapper.children().state('currentMonth').getFullYear()).to.equal(
      true
    );
    expect(instance.state.currentMonth.getFullYear()).to.equal(2016);
    expect(instance.state.currentMonth.getMonth()).to.equal(1);
    expect(instance.state.currentMonth.getDate()).to.equal(1);
  });
  it('should not do anything when other props are updated', () => {
    const wrapper = mount(
      <DayPicker className="daypicker" month={new Date(2018, 10, 11)} />
    );
    wrapper.setProps({ initialMonth: new Date(2014, 10, 11) });
    const instance = wrapper.instance();
    expect(instance.state.currentMonth.getFullYear()).to.equal(2018);
    expect(instance.state.currentMonth.getMonth()).to.equal(10);
    expect(instance.state.currentMonth.getDate()).to.equal(1);
  });
  it('should render multiple months', () => {
    const wrapper = mount(
      <DayPicker className="daypicker" numberOfMonths={12} />
    );
    expect(wrapper.find('.daypicker__month')).to.have.length(12);
  });
  it('should render multiple months, reversed', () => {
    const wrapper = mount(
      <DayPicker
        className="daypicker"
        initialMonth={new Date(2015, 0)}
        numberOfMonths={2}
        reverseMonths
      />
    );

    expect(wrapper.find('.daypicker__month__caption').at(0)).to.have.text(
      'February 2015'
    );
    expect(wrapper.find('.daypicker__month__caption').at(1)).to.have.text(
      'January 2015'
    );
  });
  it('should not include the interactionDisabled CSS modifier', () => {
    const wrapper = shallow(
      <DayPicker className="daypicker" onDayClick={() => {}} />
    );
    expect(wrapper).to.not.have.className('daypicker__-interactionDisabled');
  });
  it('should include the given className', () => {
    const wrapper = shallow(<DayPicker className="given" />);
    expect(wrapper).to.have.className('given');
  });
  it('should have the application role', () => {
    const wrapper = shallow(<DayPicker className="daypicker" />);
    expect(wrapper).to.have.attr('role', 'application');
  });
  it('should use the given tabIndex', () => {
    const wrapper = shallow(<DayPicker className="daypicker" tabIndex={-1} />);
    expect(wrapper).to.have.attr('tabindex', '-1');
  });
  it('should spread props to the container', () => {
    const wrapper = shallow(
      <DayPicker className="daypicker" containerProps={{ 'data-foo': 'bar' }} />
    );
    expect(wrapper).to.have.attr('data-foo', 'bar');
  });
  it('should handle focus and blur events', () => {
    const handleBlur = spy();
    const handleFocus = spy();
    const wrapper = mount(
      <DayPicker
        className="daypicker"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
    wrapper.simulate('focus');
    wrapper.simulate('blur');
    expect(handleBlur).to.have.been.calledOnce;
    expect(handleFocus).to.have.been.calledOnce;
  });
  it('should include the navigation bar', () => {
    const wrapper = render(<DayPicker className="daypicker" />);
    expect(wrapper.find('.daypicker__navbar')).to.exist;
  });
  it('should render the aria labels', () => {
    const wrapper = render(<DayPicker className="daypicker" />);
    expect(wrapper.find('.daypicker__navbar__button--prev')).to.have.attr(
      'aria-label',
      'Previous Month'
    );
    expect(wrapper.find('.daypicker__navbar__button--next')).to.have.attr(
      'aria-label',
      'Next Month'
    );
  });
  it('should render the day cells', () => {
    const wrapper = render(
      <DayPicker className="daypicker" initialMonth={new Date(2015, 6)} />
    );
    expect(wrapper.find('.daypicker__day')).to.have.length(35);
  });
  it("should skip the navigation bar if can't change month", () => {
    const wrapper = render(
      <DayPicker className="daypicker" canChangeMonth={false} />
    );
    expect(wrapper.find('.daypicker__navbar')).to.not.exist;
  });
  it('should render a custom content for the cell', () => {
    const renderDay = (day, modifiers) => {
      if (modifiers.foo) {
        return 'bar';
      }
      return 'foo';
    };
    const wrapper = render(
      <DayPicker
        className="daypicker"
        enableOutsideDays
        modifiers={{ foo: () => true }}
        renderDay={renderDay}
      />
    );
    expect(wrapper.find('.daypicker__day').first()).to.have.text('bar');
  });
  it('should render a custom number of months', () => {
    const wrapper = render(
      <DayPicker className="daypicker" numberOfMonths={3} />
    );
    expect(wrapper.find('.daypicker__month')).to.have.length(3);
  });
  it('should render a custom caption element', () => {
    const Caption = () => <p>boo</p>;
    const wrapper = mount(
      <DayPicker className="daypicker" captionElement={<Caption />} />
    );
    expect(wrapper.containsMatchingElement(<Caption />)).to.be.true;
  });
  it('should render a custom caption element as a function', () => {
    const Caption = () => <p>boo</p>;
    const wrapper = mount(
      <DayPicker className="daypicker" captionElement={Caption} />
    );
    expect(wrapper.containsMatchingElement(<Caption />)).to.be.true;
  });
  it('should render a custom caption element as a class', () => {
    /* eslint-disable react/prefer-stateless-function */
    /* eslint-disable react/no-multi-comp */
    class Caption extends React.Component {
      render() {
        return <p>boo</p>;
      }
    }
    const wrapper = mount(
      <DayPicker className="daypicker" captionElement={Caption} />
    );
    expect(wrapper.containsMatchingElement(<Caption />)).to.be.true;
    /* eslint-enable react/no-multi-comp */
    /* eslint-enable react/prefer-stateless-function */
  });
  it('should render a custom navbar element', () => {
    const CustomNavbar = ({ style }) => <div {...style}>Navbar</div>;
    CustomNavbar.propTypes = { className: PropTypes.string };
    const navbar = <CustomNavbar />;
    const dayPicker = <DayPicker navbarElement={navbar} className="test" />;
    const wrapper = mount(dayPicker);

    expect(isElement(wrapper.props().navbarElement)).to.be.true;
    expect(wrapper.containsMatchingElement(navbar)).to.be.true;
    expect(wrapper.find('.test__navbar')).to.exist;
    // expect(wrapper.find('.daypicker__navbar').at(0)).to.have.text('Navbar');
  });
  it('should render a custom navbar element as a function', () => {
    const CustomNavbar = ({ style }) => <div {...style}>Navbar</div>;
    CustomNavbar.propTypes = { className: PropTypes.string };
    const wrapper = mount(
      <DayPicker className="daypicker" navbarElement={CustomNavbar} />
    );

    expect(wrapper.containsMatchingElement(<CustomNavbar />)).to.be.true;
    expect(wrapper.find('.daypicker__navbar')).to.exist;
    expect(wrapper.find('.daypicker__navbar').at(0)).to.have.text('Navbar');
  });
  it('should render a custom navbar element as a class', () => {
    /* eslint-disable react/prefer-stateless-function */
    /* eslint-disable react/no-multi-comp */
    class CustomNavbar extends React.Component {
      static propTypes = { className: PropTypes.string };
      render() {
        return <div className={this.props.className}>Navbar</div>;
      }
    }
    const wrapper = mount(<DayPicker navbarElement={CustomNavbar} />);

    expect(wrapper.containsMatchingElement(<CustomNavbar />)).to.be.true;
    expect(wrapper.find('.daypicker__navbar')).to.exist;
    // expect(wrapper.find('.daypicker__navbar').at(0)).to.have.text('Navbar');
    /* eslint-enable react/prefer-stateless-function */
    /* eslint-enable react/no-multi-comp */
  });
  it('should render a custom weekday element', () => {
    const CustomWeekday = ({ className, weekday }) => (
      <div className={className}>{weekday}</div>
    );
    CustomWeekday.propTypes = {
      className: PropTypes.string,
      weekday: PropTypes.number,
    };
    const weekday = <CustomWeekday />;
    const dayPicker = (
      <DayPicker className="daypicker" weekdayElement={weekday} />
    );
    const wrapper = mount(dayPicker);

    expect(isElement(dayPicker.props.weekdayElement)).to.be.true;
    expect(wrapper.containsMatchingElement(weekday)).to.be.true;
    expect(wrapper.find('.daypicker__month__weekdays__weekday')).to.have.length(
      7
    );
    const weekdayDoms = wrapper.find('.daypicker__month__weekdays__weekday');
    weekdayDoms.forEach((_, i) => {
      expect(weekdayDoms.at(i)).to.have.text(i);
    });
  });
  it('should render a custom weekday element as a function', () => {
    const CustomWeekday = ({ className, weekday }) => (
      <div className={className}>{weekday}</div>
    );
    CustomWeekday.propTypes = {
      className: PropTypes.string,
      weekday: PropTypes.number,
    };
    const dayPicker = (
      <DayPicker className="daypicker" weekdayElement={CustomWeekday} />
    );
    const wrapper = mount(dayPicker);

    expect(wrapper.containsMatchingElement(<CustomWeekday />)).to.be.true;
    expect(wrapper.find('.daypicker__month__weekdays__weekday')).to.have.length(
      7
    );
    const weekdayDoms = wrapper.find('.daypicker__month__weekdays__weekday');
    weekdayDoms.forEach((_, i) => {
      expect(weekdayDoms.at(i)).to.have.text(i);
    });
  });
  it('should render a custom weekday element as a class', () => {
    /* eslint-disable react/prefer-stateless-function */
    /* eslint-disable react/no-multi-comp */
    class CustomWeekday extends React.Component {
      static propTypes = {
        className: PropTypes.string,
        weekday: PropTypes.number,
      };
      render() {
        return <div className={this.props.className}>{this.props.weekday}</div>;
      }
    }
    const dayPicker = (
      <DayPicker className="daypicker" weekdayElement={CustomWeekday} />
    );
    const wrapper = mount(dayPicker);

    expect(wrapper.containsMatchingElement(<CustomWeekday />)).to.be.true;
    expect(wrapper.find('.daypicker__month__weekdays__weekday')).to.have.length(
      7
    );
    const weekdayDoms = wrapper.find('.daypicker__month__weekdays__weekday');
    weekdayDoms.forEach((_, i) => {
      expect(weekdayDoms.at(i)).to.have.text(i);
    });
    /* eslint-enable react/prefer-stateless-function */
    /* eslint-enable react/no-multi-comp */
  });
  it('should not render the outside days', () => {
    const wrapper = mount(
      <DayPicker className="daypicker" initialMonth={new Date(2015, 6)} />
    );
    expect(wrapper.find('.daypicker__day').at(0)).to.have.text('');
    expect(wrapper.find('.daypicker__day').at(1)).to.have.text('');
    expect(wrapper.find('.daypicker__day').at(2)).to.have.text('');
  });
  it('should render the outside days', () => {
    const wrapper = mount(
      <DayPicker
        className="daypicker"
        enableOutsideDays
        initialMonth={new Date(2015, 6)}
      />
    );
    expect(wrapper.find('.daypicker__day').at(0)).to.have.text('28');
    expect(wrapper.find('.daypicker__day').at(1)).to.have.text('29');
    expect(wrapper.find('.daypicker__day').at(2)).to.have.text('30');
  });
  it('should render the fixed amount of weeks', () => {
    const wrapper = mount(
      <DayPicker
        className="daypicker"
        enableOutsideDays
        fixedWeeks
        initialMonth={new Date(2015, 1)}
      />
    );
    expect(wrapper.find('.daypicker__day')).to.have.length(42);
  });
  it('should render the today button', () => {
    const wrapper = mount(
      <DayPicker
        className="daypicker"
        todayButton="foo"
        initialMonth={new Date(2015, 1)}
      />
    );
    expect(wrapper.find('.daypicker__month__footer')).to.exist;
    expect(wrapper.find('.daypicker__todayButton')).to.have.text('foo');
  });
  it('should render the week numbers', () => {
    const wrapper = mount(
      <DayPicker
        className="daypicker"
        showWeekNumbers
        initialMonth={new Date(2015, 1)}
      />
    );
    expect(wrapper.find('.daypicker__month__weekNumber')).to.have.length(4);
    expect(wrapper.find('.daypicker__month__weekNumber').at(1)).to.have.text(
      '6'
    );
  });
  it('should use the specified class names', () => {
    const wrapper = mount(
      <DayPicker
        className="daypicker"
        enableOutsideDays
        initialMonth={new Date(2015, 1)}
        classNames={{
          day: {
            className: 'foo',
          },
        }}
        modifiers={{
          bar: new Date(2015, 1, 10),
        }}
      />
    );
    expect(wrapper.find('.foo')).to.have.length(28);
    expect(wrapper.find('.foo__bar')).to.have.length(1);
  });
});
