import { useEffect, useState } from 'react';
import moment from 'moment';

// import styles from '../styles/main.scss';

import Grid from '@material-ui/core/Grid';
import { format, add } from "date-fns";
import thLocale from "date-fns/locale/th";
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker
} from '@material-ui/pickers';
import Header from '../components/header';
import DashTable from '../components/dash-tables';

class ThLocalizedUtils extends DateFnsUtils {
  getYearText(date) {
    return format(add(date, {years: 543}), "yyyy", { locale: this.locale });
  }

  getCalendarHeaderText(date) {
    return format(add(date, {years: 543}), "MMMM yyyy", { locale: this.locale });
  }

  getDatePickerHeaderText(date) {
    return format(date, "dd MMMM", { locale: this.locale });
  }
}

export default function Home() {
  const [selectedDate, handleDateChange] = useState(Date.now())
  const [selectedTime, handleTimeChange] = useState(Date.now())
  const [resData, setResData] = useState([])
  const [dateQueue, setDateQueue] = useState([])

  useEffect(async() => {
    await fetch('/api/vendor').then(response => response.json())
    .then(data => {
      setResData(data.data)

      data.data.map(e => {
        setDateQueue(x => [...x, moment(e.registered).format('X')]);
      })
    }).catch(error => {
      console.log(error)
      setResData([])
    });
  }, [])

  const limitDate = () => {
    let _minD = '1990-01-01'
    let _maxD = '1990-01-01'

    if(dateQueue.length === resData.length) {
      _minD = moment(Math.min(...dateQueue) * 1000).format('YYYY-MM-DD')
      _maxD = moment(Math.max(...dateQueue) * 1000).format('YYYY-MM-DD')
    }

    return { _minD, _maxD }
  }

  return (
    <div>
      <Header />
      <div className="container">
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <MuiPickersUtilsProvider utils={ThLocalizedUtils} locale={thLocale}>
              <KeyboardDatePicker
                margin="normal"
                format="MM/dd/yyyy"
                value={add(selectedDate, {years: 543})}
                onChange={handleDateChange}
                minDate={limitDate()._minD}
                maxDate={limitDate()._maxD}
                minDateMessage={''}
                maxDateMessage={''}
              />
            </MuiPickersUtilsProvider>
          </Grid>

          <Grid item xs={6}>
            <MuiPickersUtilsProvider utils={ThLocalizedUtils} locale={thLocale}>
              <KeyboardTimePicker
                margin="normal"
                value={selectedTime}
                onChange={handleTimeChange}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <DashTable resData={resData} />
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
