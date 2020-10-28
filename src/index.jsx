import React from 'react';
import ReactDOM from 'react-dom';
import { RequestProvider } from 'react-request-hook';

import DateFnsUtils from '@date-io/date-fns';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import axios from 'axios';
import enLocale from 'date-fns/locale/en-US';

import App from './App';
import { theme } from './theme';

import './index.css';

const axiosInstance = axios.create({
  baseURL: '/api',
});

ReactDOM.render(
  <RequestProvider value={axiosInstance}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={enLocale}>
        <App />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </RequestProvider>,
  document.getElementById('root')
);
