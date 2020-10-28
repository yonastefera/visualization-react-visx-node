const express = require('express');

const { createManager } = require('./dataManager');

const {
  getTotalsByDates,
  filterValuesByStateAndDate,
  states,
  defaultTotals,
  uniqDates,
} = createManager();

const app = express();

if (process.env.NODE_ENV !== 'development') {
  app.use(express.static('build'));
}

app.get('/api/getStates', function(req, res) {
  res.json({ states });
});

app.get('/api/getAvailableDates', function(req, res) {
  res.json({ uniqDates });
});

app.get('/api/getDataByFilter', async function(req, res) {
  try {
    const {
      query: { state, startDate, endDate },
    } = req;
    if (!state) {
      res.status(404).send('You need to pass state');
      return;
    }
    const data = await filterValuesByStateAndDate(state, startDate, endDate);
    res.json({ values: data });
  } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
});

app.get('/api/getTotalsByFilter', async function(req, res) {
  try {
    const {
      query: { startDate, endDate },
    } = req;
    if (!startDate || !endDate) {
      res.json({ data: defaultTotals });
      return;
    }
    const data = await getTotalsByDates(startDate, endDate);
    res.json({ data });
  } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
});

app.listen(process.env.PORT || 5500, function() {
  console.log(`Server start on ${process.env.PORT || 5500} port`);
});
