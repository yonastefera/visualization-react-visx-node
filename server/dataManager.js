const travel = require('./national_travel.json');

/* all states enum */
const states = {};
/* precaclulated default total for first request */
const totalByState = {};
/* all uniq dates */
const uniqDates = {};
/* values divided by states with map date to index of value for increasing filtering speed */
const valuesByState = {};

const trimTime = date => {
  return date.split('T')[0];
};

const getTotalsByDates = (startDate, endDate) => {
  return new Promise(res => {
    const totals = {};
    const trimmedDate = trimTime(startDate);
    const trimmedEndDate = trimTime(endDate);

    Object.keys(valuesByState).forEach(key => {
      totals[key] = 0;
      const valueByState = valuesByState[key];
      const startIndex = valueByState.indexByDate[trimmedDate];
      const endIndex = valueByState.indexByDate[trimmedEndDate];

      for (let i = startIndex; i <= endIndex; i += 1) {
        totals[key] += valueByState.values[i].value;
      }
    });
    res(totals);
  });
};

const filterValuesByStateAndDate = (state, startDate, endDate) => {
  return new Promise((res, rej) => {
    if (!state || !valuesByState[state]) {
      rej(new Error('You need to provide correct state value'));
      return;
    }

    if (!startDate) {
      res(valuesByState[state].values);
    }

    const startIndex = valuesByState[state].indexByDate[trimTime(startDate)];
    const endIndex = valuesByState[state].indexByDate[trimTime(endDate)];

    res([...valuesByState[state].values].splice(startIndex, endIndex - startIndex + 1));
  });
};

/* create data manager and precalculate data to increase response speed */
const createManager = () => {
  travel.data.forEach(x => {
    const tripDate = trimTime(x.trip_date);
    states[x.home_state] = x.home_state;
    totalByState[x.home_state] = x.trip_count + (totalByState[x.home_state] || 0);
    uniqDates[tripDate] = tripDate;
    const valueByState = valuesByState[x.home_state];
    if (!valueByState) {
      valuesByState[x.home_state] = {
        values: [{ value: x.trip_count, date: x.trip_date }],
        indexByDate: {
          [tripDate]: 0,
        },
      };
    } else {
      if (valueByState.values[valueByState.values.length - 1].date === x.trip_date) {
        valueByState.values[valueByState.values.length - 1].value += x.trip_count;
        return;
      }
      valueByState.values.push({ value: x.trip_count, date: x.trip_date });
      const value = valueByState.indexByDate[tripDate];
      if (value === undefined || value === null) {
        valueByState.indexByDate[tripDate] = valueByState.values.length - 1;
      }
    }
  });
  return {
    getTotalsByDates,
    filterValuesByStateAndDate,
    states: Object.keys(states),
    defaultTotals: totalByState,
    uniqDates: Object.keys(uniqDates),
  };
};

module.exports = {
  createManager,
};
