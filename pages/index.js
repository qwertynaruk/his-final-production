import { useEffect, useState } from 'react';

// Material Template
import {Grid, TextField, Button} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Icon from '@material-ui/core/Icon';

// Date & Time picker lib
import moment from 'moment';
import { format, add } from "date-fns";
import thLocale from "date-fns/locale/th";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker
} from '@material-ui/pickers';

// Include Component
import Header from '../components/header';
import DashTable from '../components/dash-tables';
import BgParticles from '../components/bg-particles';

class ThLocalizedUtils extends DateFnsUtils {
  getYearText(date) {
    return format(add(date, {years: 543}), "yyyy", { locale: this.locale });
  }

  format(date, _format) {
    return format(add(date, {years: 543}), _format, { locale: this.locale });
  }

  getCalendarHeaderText(date) {
    return format(add(date, {years: 543}), "MMMM yyyy", { locale: this.locale });
  }

  getDatePickerHeaderText(date) {
    return format(date, "dd MMMM", { locale: this.locale });
  }
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(Date.now())
  const [selectedTime, handleTimeChange] = useState(Date.now())
  const [resData, setResData] = useState([])
  const [rawData, setRawData] = useState([])
  const [dateQueue, setDateQueue] = useState([])
  const [autoSearch, setAutoSearch] = useState('')

  useEffect(async() => {
    await fetch('/api/vendor').then(response => response.json())
    .then(data => {
      setResData(data.data)
      setRawData(data.data)

      data.data.map(e => {
        setDateQueue(x => [...x, moment(e.registered).format('X')]);
      })
    }).catch(error => {
      console.log(error)
      setResData([])
    });
  }, [])

  const clearForm = () => {
    setSelectedDate(Date.now())
    setResData(rawData)
    setAutoSearch('')
  }

  const limitDate = () => {
    let _minD = '1990-01-01'
    let _maxD = '1990-01-01'

    if(dateQueue.length === resData.length) {
      _minD = moment(Math.min(...dateQueue) * 1000).format('YYYY-MM-DD')
      _maxD = moment(Math.max(...dateQueue) * 1000).format('YYYY-MM-DD')
    }

    return { _minD, _maxD }
  }

  const handleDateChange = async (dt) => {
    setSelectedDate(dt)

    const formatting = moment(moment(dt).format('YYYY-MM-DD')).format('X')
    const x = resData.filter(x => moment(x.registered).format('X') === formatting)
    setResData(x)
  }

  const handleSearch = async (event) => {
    const vs = event.target.value
    setAutoSearch(vs)
    setSelectedDate(Date.now())

    if(!vs) {
      setResData(rawData); 
      return true
    }
    
    await fetch(`/api/search/name/${vs}`).then(response => response.json())
    .then(data => {
      const { code, now } = data
      setResData(code === 200 ? now : [])
    }).catch(error => {
      setResData([])
    });
  }

  return (
    <div>
      <Header />

      <div className="bgCanvas">
        <BgParticles />
      </div>

      <div className="container">
        <Grid container spacing={1} className="searchGroup">
         
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              value={autoSearch}
              onChange={handleSearch}
              label="ค้นหาด้วยชื่อร้าน"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MuiPickersUtilsProvider utils={ThLocalizedUtils} locale={thLocale}>
              <KeyboardDatePicker
                margin="normal"
                format="MM/dd/yyyy"
                value={selectedDate}
                onChange={handleDateChange}
                minDate={limitDate()._minD}
                maxDate={limitDate()._maxD}
                minDateMessage={''}
                maxDateMessage={''}
              />
            </MuiPickersUtilsProvider>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MuiPickersUtilsProvider utils={ThLocalizedUtils} locale={thLocale}>
              <KeyboardTimePicker
                margin="normal"
                value={selectedTime}
                onChange={handleTimeChange}
              />
            </MuiPickersUtilsProvider>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DeleteIcon />}
              onClick={clearForm}
            >
              Clear Search
            </Button>
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
