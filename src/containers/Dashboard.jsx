import React, { useCallback, useMemo, useState } from 'react';

import { Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { DatePicker } from '@material-ui/pickers';
import { format } from 'date-fns';

import { CustomSelector } from '../components/CustomSelector';
import { ResponsiveLineChart } from '../components/LineChart';
import { Title } from '../components/Title';
import { UsaMap } from '../components/UsaMap';

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 40,
      textAlign: 'center',
    },
    visualisationItem: {
      height: '600px',
      width: '80%',
      maxWidth: '1100px',
      marginBottom: 30,
      [theme.breakpoints.down('md')]: {
        height: '500px',
        width: '90%',
      },
      [theme.breakpoints.down('sm')]: {
        height: '400px',
        width: '100%',
      },
    },
    filtersContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 30,
      marginTop: 15,
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    pickerContainer: {
      display: 'flex',
      alignItems: 'center',
      marginRight: 15,
    },
    h1Text: {
      fontSize: '6rem',
      [theme.breakpoints.down('md')]: {
        fontSize: '4rem',
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: '2rem',
      },
    },
    h3Text: {
      marginBottom: '.5rem',
      fontSize: '3rem',
      [theme.breakpoints.down('md')]: {
        fontSize: '2rem',
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: '1rem',
      },
    },
  })
);

export function Dashboard({ tripData, totalsByDate, states, availableDates, onFiltersChanged }) {
  const [selectedDate, setSelectedDate] = useState(availableDates[0]);
  const [selectedEndDate, setSelectedEndDate] = useState(availableDates[availableDates.length - 1]);
  const [selectedState, setSelectedState] = useState(states[0]);
  const styles = useStyles();
  const handleDateChange = useCallback(
    date => {
      setSelectedDate(date);
      onFiltersChanged({
        startDate: format(new Date(date), 'yyyy-MM-dd'),
        endDate: format(new Date(selectedEndDate), 'yyyy-MM-dd'),
        state: selectedState,
      });
    },
    [setSelectedDate, selectedEndDate, onFiltersChanged, selectedState]
  );
  const handleEndDateChange = useCallback(
    date => {
      setSelectedEndDate(date);
      onFiltersChanged({
        startDate: format(new Date(selectedDate), 'yyyy-MM-dd'),
        endDate: format(new Date(date), 'yyyy-MM-dd'),
        state: selectedState,
      });
    },
    [setSelectedEndDate, selectedDate, onFiltersChanged, selectedState]
  );
  const handleStateChanged = useCallback(
    state => {
      setSelectedState(state);
      onFiltersChanged({
        startDate: format(new Date(selectedDate), 'yyyy-MM-dd'),
        endDate: format(new Date(selectedEndDate), 'yyyy-MM-dd'),
        state,
      });
    },
    [selectedDate, selectedEndDate, setSelectedState, onFiltersChanged]
  );
  const stateOptions = useMemo(() => {
    return states.map(x => ({ title: x, value: x }));
  }, [states]);
  const { startDate, endDate } = useMemo(() => {
    return {
      startDate: new Date(availableDates[0]),
      endDate: new Date(availableDates[availableDates.length - 1]),
    };
  }, [availableDates]);
  return (
    <div className={styles.container}>
      <Typography className={styles.h1Text} variant='h1' component='h1'>
        Visualisation of travel dataset
      </Typography>
      <section className={styles.filtersContainer}>
        <section className={styles.pickerContainer}>
          <Title>Select date of start</Title>
          <DatePicker
            minDate={startDate}
            maxDate={selectedEndDate}
            value={selectedDate}
            onChange={handleDateChange}
          />
        </section>
        <section className={styles.pickerContainer}>
          <Title>Select date of end</Title>
          <DatePicker
            minDate={selectedDate}
            maxDate={endDate}
            value={selectedEndDate}
            onChange={handleEndDateChange}
          />
        </section>
        <CustomSelector
          title='Select state'
          options={stateOptions}
          value={selectedState}
          onChange={handleStateChanged}
        />
      </section>

      <Typography className={styles.h3Text} variant='h3' component='h3'>
        Linear representation of trips by time
      </Typography>
      <section className={styles.visualisationItem}>
        {tripData.data && (
          <ResponsiveLineChart label={`State ${selectedState}`} values={tripData.data.values} />
        )}
      </section>

      <Typography className={styles.h3Text} variant='h3' component='h3'>
        Total trips for states by date of start
      </Typography>
      <section className={styles.visualisationItem}>
        {totalsByDate && totalsByDate.data && <UsaMap data={totalsByDate.data} />}
      </section>
    </div>
  );
}
