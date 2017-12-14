// model.js

import moment from 'moment';

export default class Model {
  constructor() {
    this.now = moment().day(15);
  };
  setDate(month, year) {
    this.now.month(month).year(year);
  };
  getDays() {
    const days = [];
    const calendarStart = moment(this.now).startOf('month');
    const calendarEnd = moment(this.now).endOf('month');
    const timeRange = calendarEnd.valueOf() - calendarStart.valueOf();
    const daysInView = Math.floor(moment.duration( timeRange ).asDays());

    for (let i = 0; i <= daysInView; i++) {
      days.push({
        iso: moment(calendarStart).add(i, 'days').toISOString()
      });
    };

    return days;
  };
  toJSON() {
    const iso = this.now.toISOString();
    const days = this.getDays();

    return { iso, days };
  };
}