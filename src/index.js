import './styles.sass'
import { getDay, parseISO } from 'date-fns'

const searchButton = document.getElementById('searchButton')

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

  for (let i = 0; i < days.length; i++) {
    days[i].textContent = getDaysOfDates(getStringDates())[i]
    /*const icon = document.createElement('img')
    icon.src = APIobj.forecast.forecastday[i].day.condition.icon
    weatherIcons[i].appendChild(icon) */
    rainChances[i].textContent = `${APIobj.forecast.forecastday[i].day.daily_chance_of_rain}%`
    tempsDay[i].textContent = `${APIobj.forecast.forecastday[i].day.maxtemp_c}°C`
    tempsNight[i].textContent = `${APIobj.forecast.forecastday[i].day.mintemp_c}°C`
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
searchButton.addEventListener('click', async () => {
  await getJson(getUserInput())
  setTheme()
  updateElements()
  console.log(APIobj)
})

await getJson('budapest')
updateElements()
setTheme()