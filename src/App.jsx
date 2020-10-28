import React, { useCallback, useEffect, useMemo } from 'react';
import { useResource } from 'react-request-hook';

import { Dashboard } from './containers/Dashboard';

function App() {
  const [states, getStates] = useResource(() => ({
    url: '/getStates',
    method: 'get',
  }));
  const [availableDates, getAvailableDates] = useResource(() => ({
    url: '/getAvailableDates',
    method: 'get',
  }));
  const [totalsByDate, getTotalsByDate] = useResource(({ startDate, endDate, isEmpty }) => ({
    url: `/getTotalsByFilter${!isEmpty ? `?startDate=${startDate}&endDate=${endDate}` : ''}`,
    method: 'get',
  }));
  const [tripData, getTripData] = useResource(({ state, startDate, endDate, isEmptyDate }) => ({
    url: `/getDataByFilter?state=${state}${
      !isEmptyDate ? `&startDate=${startDate}&endDate=${endDate}` : ''
    }`,
    method: 'get',
  }));
  useEffect(() => {
    getStates();
    getAvailableDates();
    getTotalsByDate({ isEmpty: true });
  }, [getStates, getAvailableDates, getTotalsByDate]);
  useEffect(() => {
    if (states.data) {
      getTripData({ state: states.data.states[0], isEmptyDate: true });
    }
  }, [states, getTripData]);
  const handleFiltersChanged = useCallback(
    ({ startDate, endDate, state }) => {
      getTotalsByDate({ startDate, endDate });
      getTripData({ state, startDate, endDate });
    },
    [getTotalsByDate, getTripData]
  );

  /* hack for timezones. I want to show the same date for each time zone */
  const mappedDate = useMemo(() => {
    if (!availableDates.data) {
      return [];
    }

    return availableDates.data.uniqDates.map(x => {
      const newDate = x.split('-');
      const year = parseInt(newDate[0], 10);
      const month = parseInt(newDate[1], 10) - 1;
      const day = parseInt(newDate[2], 10);
      return new Date(year, month, day);
    });
  }, [availableDates]);

  return (
    <div className='App'>
      {availableDates.data && states.data && (
        <Dashboard
          onFiltersChanged={handleFiltersChanged}
          states={states.data.states}
          availableDates={mappedDate}
          tripData={tripData}
          totalsByDate={totalsByDate.data}
        />
      )}
    </div>
  );
}

export default App;
