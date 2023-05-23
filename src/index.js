import './styles.sass'
import { getDay, parseISO } from 'date-fns'
import weatherCondition from './weather_conditions.json' assert { type: 'json' }

const searchButton = document.getElementById('searchButton')
const cityInput = document.getElementById('cityInput')

let APIobj

function getUserInput() {
  return document.getElementById('cityInput').value
}
async function getJson(city) {
  await fetch (`https://api.weatherapi.com/v1/forecast.json?key=6af6b71308c846c582175142232105&q=${city}&days=7&aqi=no&alerts=no`, {mode: 'cors'})
  .then (response => {
    return response.json()
  })
  .then (response => {
    APIobj = response
  })
}
function getStringDates() {
  let stringDates = []
  for (let i = 0; i < APIobj.forecast.forecastday.length; i++) {
    stringDates.push(APIobj.forecast.forecastday[i].date)
  }
  return stringDates
}
function getDaysOfDates(dates) {
  for (let i = 0; i < dates.length; i++) {
    dates[i] = getDay(parseISO(dates[i]))
    switch (dates[i]) {
      case 0 : dates[i] = 'Sunday' 
      break
      case 1 : dates[i] = 'Monday' 
      break
      case 2 : dates[i] = 'Tuesday' 
      break
      case 3 : dates[i] = 'Wednesday' 
      break
      case 4 : dates[i] = 'Thursday' 
      break
      case 5 : dates[i] = 'Friday' 
      break
      case 6 : dates[i] = 'Saturday' 
      break
    }
  }
  return dates
}
function getIconUrl(weather) {
  let code = weather.day.condition.code
  let conditionObj = weatherCondition.find(e => e.code === code)
  let iconCode = conditionObj.icon
  if (APIobj.current.is_day === 1) {
    return `../src/icons/day/${iconCode}.png`
  } else {
    return `../src/icons/night/${iconCode}.png`
  }
}
function updateElements() {
  const cityName = document.getElementById('cityName')
  const currentTemp = document.getElementById('currentTemp')

  cityName.textContent = `${APIobj.location.name}`
  currentTemp.textContent = `${APIobj.current.temp_c}°C`

  const days = document.querySelectorAll('.day')
  const weatherIcons = document.querySelectorAll('.weatherIcon')
  const rainChances = document.querySelectorAll('.rainChance')
  const tempsDay = document.querySelectorAll('.tempDay')
  const tempsNight = document.querySelectorAll('.tempNight')
  const precipitations = document.querySelectorAll('.precipitation')

  for (let i = 0; i < days.length; i++) {
    days[i].textContent = getDaysOfDates(getStringDates())[i]
    rainChances[i].textContent = `${APIobj.forecast.forecastday[i].day.daily_chance_of_rain}%`
    tempsDay[i].textContent = `${APIobj.forecast.forecastday[i].day.maxtemp_c}°C`
    tempsNight[i].textContent = `${APIobj.forecast.forecastday[i].day.mintemp_c}°C`
    precipitations[i].textContent = `${APIobj.forecast.forecastday[i].day.totalprecip_mm}mm`

    weatherIcons[i].replaceChildren()
    const weatherIcon = document.createElement('img')
    weatherIcon.src = getIconUrl(APIobj.forecast.forecastday[i])
    weatherIcons[i].appendChild(weatherIcon)
  }
}
function setTheme() {
  const body = document.querySelector('body')
  if (APIobj.current.is_day !== 1) {
    body.classList.add('night')
  } else {
    body.classList.remove('night')
  }
}
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    searchButton.click()
  }
})
searchButton.addEventListener('click', async () => {
  await getJson(getUserInput())
  setTheme()
  updateElements()
  console.log(APIobj)
})

await getJson('budapest')
updateElements()
setTheme()